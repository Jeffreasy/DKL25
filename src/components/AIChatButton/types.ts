// src/components/AIChatButton/types.ts
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
  }
  
  export interface ChatState {
    messages: Message[];
    isTyping: boolean;
  }