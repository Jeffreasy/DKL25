import { CircularProgress } from '@mui/material';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <CircularProgress 
          sx={{ 
            color: '#ff9328',
            width: '60px !important',
            height: '60px !important'
          }} 
        />
        <div className="mt-4 font-heading">
          <h2 className="text-2xl font-bold text-primary animate-pulse">
            De Koninklijke Loop
          </h2>
          <p className="text-gray-600 mt-2">
            Laden...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 