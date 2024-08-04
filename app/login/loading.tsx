import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Loading() {
  return (
    <Card className="max-w-md w-full my-auto">
      <CardHeader>
        <CardTitle>
          <span className="w-full h-8 bg-gray-100 animate-pulse"></span>
        </CardTitle>
        <CardDescription>
          <span className="w-full h-8 bg-gray-100 animate-pulse"></span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-y-4">
          <div className="w-[180px] h-6 bg-gray-100 animate-pulse"></div>
          <div className="w-full h-6 bg-gray-100 animate-pulse"></div>
          <div className="w-[180px] h-6 bg-gray-100 animate-pulse"></div>
          <div className="w-full rounded-lg h-8 bg-gray-100 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
