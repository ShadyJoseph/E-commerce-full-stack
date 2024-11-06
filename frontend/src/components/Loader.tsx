import { TailSpin } from 'react-loader-spinner';

const Loader = ({ height = "80", width = "80", color = "#2b6cb0" }) => {
  return (
    <div className="flex items-center justify-center">
      <TailSpin
        height={height}
        width={width}
        color={color}
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;