declare module 'react-confetti' {
  import { CSSProperties } from 'react';

  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    colors?: string[];
    style?: CSSProperties;
  }

  const Confetti: React.FC<ConfettiProps>;
  export default Confetti;
} 