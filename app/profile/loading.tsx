export default async function Loading() {
  return (
    <div className="w-full min-h-screen">
      <div className="px-2 py-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center p-4 gap-y-8 w-full">
          <div className="flex items-center mx-auto space-x-4 w-full">
            <div className="w-16 h-16 bg-gray-100 animate-pulse" />
            <div className="flex flex-col">
              <p className="w-[200px] h-6 bg-gray-100 animate-pulse"></p>
              <p className="w-[240px] h-6 bg-gray-100 animate-pulse"></p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full"></div>
          <div className="flex items-center justify-between border-b pb-4 w-full">
            <h2 className="w-[300px] h-8 bg-gray-100 animate-pulse"></h2>
          </div>
        </div>
      </div>
    </div>
  );
}
