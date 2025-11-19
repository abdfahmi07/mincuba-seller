const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white" />
    </div>
  );
};

export default FullPageLoader;
