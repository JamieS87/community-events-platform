export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[90dhv] px-2">
      <div className="flex justify-center my-auto">{children}</div>
    </div>
  );
}
