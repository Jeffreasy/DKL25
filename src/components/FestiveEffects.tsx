import React from 'react';
import Snowfall from 'react-snowfall';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const FestiveEffects: React.FC = () => {
  const { width, height } = useWindowSize();
  
  return (
    <>
      {/* Sneeuweffect met minder sneeuwvlokken */}
      <Snowfall
        color="#fff"
        snowflakeCount={100}
        radius={[0.5, 2.0]}
        speed={[0.5, 2.0]}
        wind={[-0.5, 1.0]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Confetti effect met minder confetti */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={25}
        recycle={true}
        colors={['#FFD700', '#C0C0C0', '#D42426', '#165B33']}
        style={{
          position: 'fixed',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.5
        }}
      />
    </>
  );
}; 