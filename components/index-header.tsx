import Link from "next/link";

export default function IndexHeader() {
  return (
    <div className="w-full min-h-[60dvh] flex flex-col justify-center items-center gap-10">
      <h2 className="font-black text-4xl text-center">
        Community Events Platform
      </h2>
      <Link href="#latest-events">
        <p className="text-md font-normal text-center p-4 rounded-full bg-primary text-primary-foreground">
          Discover free, paid, and pay-as-you-feel events
        </p>
      </Link>
    </div>
  );
}
