import { headers } from "next/headers";

export default async function SignUpConfirmPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  return (
    <>
      <h2>Confirmation Email sent</h2>
      <p>A confirmation email has been sent to {searchParams.email}</p>
      <p>Click the link in the email to confirm your email address</p>
    </>
  );
}
