import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";

export default async function SignUpConfirmPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  return (
    <Card className="h-[90dvh] md:h-auto w-full md:my-auto md:max-w-md">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center">
          Confirmation Email Sent <CircleCheckBig className="ml-4 w-8 h-8" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center flex flex-col gap-y-4">
        <p>
          A confirmation email has been sent to
          <br />
          <span className="font-semibold">{searchParams.email}</span>
        </p>
        <p>
          If the email hasnt arrived within a few minutes, please check your
          spam folder.
        </p>
        <p>
          Click the link in the email to confirm your email address and log in
          to your account.
        </p>
      </CardContent>
    </Card>
  );
}
