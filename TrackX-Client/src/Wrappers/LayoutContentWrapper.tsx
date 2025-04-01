interface ILayoutContentWrapper {
    children ?: React.ReactNode;
    header : string;
    des ?: string
}

const LayoutContentWrapper = ({header, des, children} : ILayoutContentWrapper) => {
  return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{header}</h1>
          <p className="text-gray-400">
            {des}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
         {children}
        </div>
      </div>
  );
};

export default LayoutContentWrapper;