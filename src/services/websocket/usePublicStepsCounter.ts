/**
 * usePublicStepsCounter - Vereenvoudigde hook voor public total steps tracking
 * 
 * Deze hook is speciaal gemaakt voor de HeroSection total steps counter.
 * Het gebruikt WebSocket voor real-time updates met fallback naar polling.
 * 
 * Features:
 * - WebSocket real-time updates
 * - Automatische fallback naar REST API polling bij problemen
 * - Geen authenticatie vereist (public endpoint)
 * - Auto-reconnect
 * 
 * Usage:
 * ```tsx
 * const { totalSteps, isConnected } = usePublicStepsCounter();
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG } from '@/config/constants';

interface PublicStepsCounterState {
  totalSteps: number;
  isConnected: boolean;
  lastUpdate: number;
}

const WEBSOCKET_CONFIG = {
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  fallbackPollingInterval: 10000, // Poll elke 10 seconden als WebSocket faalt
} as const;

/**
 * Hook voor public total steps counter met WebSocket + polling fallback
 */
export function usePublicStepsCounter() {
  const [state, setState] = useState<PublicStepsCounterState>({
    totalSteps: 0,
    isConnected: false,
    lastUpdate: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);

  /**
   * Fetch steps via REST API (fallback)
   */
  const fetchStepsViaREST = useCallback(async (): Promise<number> => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/total-steps`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.warn('[usePublicStepsCounter] REST API not available');
        return 0;
      }

      const data = await response.json();
      const steps = data.total_steps || 0;
      console.log('[usePublicStepsCounter] REST API returned:', steps, 'steps');
      return steps;
    } catch (error) {
      console.error('[usePublicStepsCounter] REST API error:', error);
      return 0;
    }
  }, []);

  /**
   * Start polling fallback
   */
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;

    console.log('[usePublicStepsCounter] Starting polling fallback');
    
    // Initial fetch
    fetchStepsViaREST().then(steps => {
      setState(prev => ({ ...prev, totalSteps: steps, lastUpdate: Date.now() }));
    });

    // Periodic fetches
    pollingIntervalRef.current = window.setInterval(() => {
      fetchStepsViaREST().then(steps => {
        setState(prev => ({ ...prev, totalSteps: steps, lastUpdate: Date.now() }));
      });
    }, WEBSOCKET_CONFIG.fallbackPollingInterval);
  }, [fetchStepsViaREST]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log('[usePublicStepsCounter] Stopped polling');
    }
  }, []);

  /**
   * Connect to WebSocket with public user_id
   */
  const connectWebSocketWithPublicUser = useCallback(() => {
    // Don't reconnect if we're at max attempts
    if (reconnectAttemptsRef.current >= WEBSOCKET_CONFIG.maxReconnectAttempts) {
      console.warn('[usePublicStepsCounter] Max reconnect attempts reached, using polling only');
      startPolling();
      return;
    }

    // Get WebSocket URL - gebruik /api/ws/steps met public user_id
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsBaseUrl = API_CONFIG.baseUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${wsBaseUrl}/api/ws/steps?user_id=public&token=`;

    console.log('[usePublicStepsCounter] Connecting to:', wsUrl.replace(/token=.*/, 'token=[HIDDEN]'));

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[usePublicStepsCounter] WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true }));
        reconnectAttemptsRef.current = 0;
        stopPolling(); // Stop polling when WebSocket is connected

        // Subscribe to total updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: ['total_updates'],
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[usePublicStepsCounter] WebSocket message:', message);

          if (message.type === 'total_update') {
            setState(prev => ({
              ...prev,
              totalSteps: message.total_steps || 0,
              lastUpdate: Date.now(),
            }));
          }
        } catch (error) {
          console.error('[usePublicStepsCounter] Message parse error:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[usePublicStepsCounter] WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('[usePublicStepsCounter] WebSocket closed:', event.code, event.reason);
        setState(prev => ({ ...prev, isConnected: false }));
        wsRef.current = null;

        // If not a clean close, try to reconnect
        if (event.code !== 1000) {
          reconnectAttemptsRef.current++;
          
          if (reconnectAttemptsRef.current < WEBSOCKET_CONFIG.maxReconnectAttempts) {
            console.log(`[usePublicStepsCounter] Reconnecting... (attempt ${reconnectAttemptsRef.current})`);
            reconnectTimeoutRef.current = window.setTimeout(() => {
              connectWebSocketWithPublicUser();
            }, WEBSOCKET_CONFIG.reconnectInterval);
          } else {
            // Start polling as fallback
            startPolling();
          }
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[usePublicStepsCounter] WebSocket creation error:', error);
      reconnectAttemptsRef.current++;
      startPolling();
    }
  }, [startPolling, stopPolling]);

  /**
   * Initialize connection
   */
  useEffect(() => {
    // Try WebSocket first
    connectWebSocketWithPublicUser();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmount');
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopPolling();
    };
  }, [connectWebSocketWithPublicUser, stopPolling]);

  return {
    totalSteps: state.totalSteps,
    isConnected: state.isConnected,
    lastUpdate: state.lastUpdate,
  };
}

export default usePublicStepsCounter;