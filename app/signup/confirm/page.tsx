import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignUpConfirmPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  return (
    <Card className="h-[90dvh] md:h-auto w-full md:my-auto md:max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Confirmation Email Sent</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p>
          A confirmation email has been sent to{" "}
          <span className="font-semibold">{searchParams.email}</span>
        </p>
        <p>Click the link in the email to confirm your email address</p>
      </CardContent>
    </Card>
  );
}
