declare module 'react-snowfall' {
  import { FC, CSSProperties } from 'react';
  
  interface SnowfallProps {
    color?: string;
    snowflakeCount?: number;
    style?: CSSProperties;
    radius?: [number, number];
    speed?: [number, number];
    wind?: [number, number];
  }
  
  const Snowfall: FC<SnowfallProps>;
  export default Snowfall;
} 