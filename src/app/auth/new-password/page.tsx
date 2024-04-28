import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/new-password-form";

const NewPasswordPage = () => (
  <Suspense>
    <NewPasswordForm />
  </Suspense>
);

export default NewPasswordPage;
