const Spinner = ({
  width = "10",
  height = "10",
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <div
      className={`animate-spin rounded-full h-${height} w-${width} border-4 border-gray-300 border-t-[#F05000]`}
    />
  );
};

export default Spinner;
