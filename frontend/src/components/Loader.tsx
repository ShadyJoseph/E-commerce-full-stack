import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // Import RootState from the store

interface LoaderProps {
  height?: string;
  width?: string;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ height = "80", width = "80", color = "#2b6cb0" }) => {
  // Access the darkMode state from Redux store
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Set color based on darkMode
  const loaderColor = darkMode ? 'white' : color;

  return (
    <div className="flex items-center justify-center">
      <TailSpin
        height={height}
        width={width}
        color={loaderColor}
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
