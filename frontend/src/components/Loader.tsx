type LoaderType = {
  size?: "small" | "medium" | "large";
};

const Loader = ({ size = "medium" }: LoaderType) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2 mt-2",
    medium: "w-10 h-10 border-4 mt-10",
    large: "w-16 h-16 border-8 mt-10",
  };

  return (
    <div className="flex justify-center">
      <div
        className={`border-4 border-blue-500 border-solid rounded-full animate-spin 
          border-r-transparent ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Loader;
