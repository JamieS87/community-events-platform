export default async function Loading() {
  return (
    <div className="w-full px-2 mx-auto">
      <div className="mx-auto flex flex-col gap-y-6 my-6 max-w-4xl w-full p-4">
        <div className="flex items-center justify-between">
          <h2 className="w-[100px] bg-gray-100 h-8 animate-pulse"></h2>
          <span className="h-[14px] px-4 py-2 bg-gray-100 rounded-full animate-pulse"></span>
        </div>
        <div className="w-full h-full aspect-video max-w-[1024px] max-h-[1024px] animate-pulse bg-gray-100"></div>
        <h3 className="h-[14px] bg-gray-100 animate-pulse"></h3>
        <p className="h-[14px] w-full bg-gray-100 animate-pulse"></p>
        <p className="h-[14px] w-full bg-gray-100 animate-pulse"></p>
        <div className="flex items-center">
          <h3 className="h-[14px] bg-gray-100 animate-pulse"></h3>
        </div>
        <div className="space-y-2">
          <p className="h-[14px] w-full bg-gray-100 animate-pulse"></p>
          <p className="h-[14px] w-full bg-gray-100 animate-pulse"></p>
        </div>
        <p className="h-[14px] w-full bg-gray-100 animate-pulse"></p>
        {/* <PurchaseEventButton user={user} event={event} /> */}
      </div>
    </div>
  );
}
