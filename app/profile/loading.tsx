export default async function Loading() {
  return (
    <div className="flex flex-col p-2 gap-y-8 mt-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center mx-auto space-x-4">
        <div className="w-16 h-16 bg-gray-100 animate-pulse" />
        <div className="flex flex-col">
          <p className="w-[200px] h-6 bg-gray-100 animate-pulse"></p>
          <p className="w-[240px] h-6 bg-gray-100 animate-pulse"></p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {/* {!googleIdentity && <LinkGoogleAccountButton />}
        {googleIdentity && identityData.identities.length > 1 && (
          <div className="flex items-center">
            <div className="w-6 h-6 mr-4">
              <GoogleIcon />
            </div>
            Google account linked
            {googleIdentity.identity_data?.email}
          </div>
        )} */}
      </div>
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="w-[300px] h-8 bg-gray-100 animate-pulse"></h2>
      </div>
      {/* <UserPurchasedEvents /> */}
    </div>
  );
}
