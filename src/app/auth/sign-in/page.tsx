import { Suspense } from "react";
import { SignInForm } from "@/components/auth/signin-form";

const SignInPage = () => (
  <Suspense>
    <SignInForm />
  </Suspense>
);

export default SignInPage;
