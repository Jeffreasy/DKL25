/**
 * WebSocket Services
 * Exporteer alle WebSocket gerelateerde functionaliteit
 */

export { StepsWebSocketClient, ConnectionState } from './stepsWebSocketClient';
export type {
  MessageType,
  StepUpdateMessage,
  TotalUpdateMessage,
  LeaderboardUpdateMessage,
  BadgeEarnedMessage,
  WebSocketMessage,
  StepsWebSocketConfig,
  LeaderboardEntry,
} from './stepsWebSocketClient';

export { useStepsWebSocket, useParticipantDashboard, useLeaderboard, useStepsMonitoring } from './useStepsWebSocket';
export type { StepsWebSocketState, UseStepsWebSocketReturn } from './useStepsWebSocket';

export { usePublicStepsCounter } from './usePublicStepsCounter';