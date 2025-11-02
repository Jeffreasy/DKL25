/**
 * usePublicStepsCounter - Public total steps tracking met WebSocket + polling fallback
 *
 * Features:
 * - WebSocket real-time updates met subscribe logic
 * - Automatische fallback naar REST API polling bij problemen
 * - Welcome message handling
 * - Multiple message types support
 * - Auto-reconnect met exponential backoff
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
  reconnectInterval: 2000,
  maxReconnectAttempts: 3,
  maxReconnectInterval: 30000,
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

    // Get WebSocket URL
    const isDevelopment = window.location.hostname === 'localhost';
    let wsUrl: string;
    
    if (isDevelopment) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}/api/ws/steps?user_id=public&token=`;
    } else {
      const protocol = API_CONFIG.baseUrl.startsWith('https') ? 'wss:' : 'ws:';
      const backendHost = API_CONFIG.baseUrl.replace(/^https?:\/\//, '');
      wsUrl = `${protocol}//${backendHost}/api/ws/steps?user_id=public&token=`;
    }

    console.log('[usePublicStepsCounter] Connecting to:', wsUrl.replace(/token=.*/, 'token=[HIDDEN]'));

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[usePublicStepsCounter] ✅ WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true }));
        reconnectAttemptsRef.current = 0;
        stopPolling();

        // ✨ CRUCIALE STAP: SUBSCRIBEN NAAR CHANNELS
        const subscribeMessage = {
          type: 'subscribe',
          channels: ['total_updates', 'step_updates', 'leaderboard_updates']
        };
        ws.send(JSON.stringify(subscribeMessage));
        console.log('[usePublicStepsCounter] ✅ Subscribed to channels:', subscribeMessage.channels);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[WebSocket] 📨 Message received:', message.type, message);

          // Handle verschillende message types
          switch (message.type) {
            case 'welcome':
              console.log('[WebSocket] 🎉 Welcome:', message.message);
              console.log('[WebSocket] 📡 Available channels:', message.available_channels);
              break;

            case 'total_update':
              setState(prev => ({
                ...prev,
                totalSteps: message.total_steps || 0,
                lastUpdate: Date.now(),
              }));
              console.log('[WebSocket] 🔄 Total steps updated:', message.total_steps);
              break;

            case 'step_update':
              console.log('[WebSocket] 👟 Participant stepped:', message.naam, '+', message.delta, 'steps');
              // De backend stuurt ook een total_update, dus we hoeven hier niets te doen
              break;

            case 'leaderboard_update':
              console.log('[WebSocket] 🏆 Leaderboard updated:', message.top_n, 'entries');
              break;

            case 'pong':
              console.log('[WebSocket] 💓 Pong received');
              break;

            default:
              console.log('[WebSocket] Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('[usePublicStepsCounter] Message parse error:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[usePublicStepsCounter] ❌ WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('[usePublicStepsCounter] 👋 WebSocket closed:', event.code, event.reason);
        setState(prev => ({ ...prev, isConnected: false }));
        wsRef.current = null;

        // Auto-reconnect met exponential backoff
        if (event.code !== 1000) {
          reconnectAttemptsRef.current++;
          
          if (reconnectAttemptsRef.current < WEBSOCKET_CONFIG.maxReconnectAttempts) {
            const delay = Math.min(
              WEBSOCKET_CONFIG.reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current - 1),
              WEBSOCKET_CONFIG.maxReconnectInterval
            );
            console.log(`[usePublicStepsCounter] 🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
            reconnectTimeoutRef.current = window.setTimeout(() => {
              connectWebSocketWithPublicUser();
            }, delay);
          } else {
            console.warn('[usePublicStepsCounter] ⚠️ Max reconnect attempts reached, switching to polling');
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