import { Suspense } from "react";
import { EmailVerificationForm } from "@/components/auth/email-verification-form";

const EmailVerificationPage = () => (
  <Suspense>
    <EmailVerificationForm />
  </Suspense>
);

export default EmailVerificationPage;
