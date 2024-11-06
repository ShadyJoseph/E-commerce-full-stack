import { TailSpin } from 'react-loader-spinner';
import { useThemeStore } from '../stores/themeStore'; // Assuming you have a store for dark mode

const Loader = ({ height = "80", width = "80", color = "#2b6cb0" }) => {
  const { darkMode } = useThemeStore((state) => state);

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
