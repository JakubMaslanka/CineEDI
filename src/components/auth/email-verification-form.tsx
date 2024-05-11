"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SymbolIcon } from "@radix-ui/react-icons";
import { emailVerifyAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

export const EmailVerificationForm = () => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleTokenVerification = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Nie znaleziono tokenu.");
      return;
    }

    emailVerifyAction(token)
      .then((result) => {
        setError(result.error);

        if (result.success) {
          setSuccess(result.success);
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 3000);
        }
      })
      .catch(() => {
        setError(
          "Wystąpił niespodziewany błąd podczas weryfikacji adresu e-mail."
        );
      });
  }, [error, router, success, token]);

  useEffect(() => {
    handleTokenVerification();
  }, [handleTokenVerification]);

  return (
    <AuthCard
      title="Trwa weryfikowanie adresu e-mail"
      footerText="Powrót do logowania"
      footerHref="/auth/sign-in"
    >
      <div>
        {!success && !error && (
          <div className="flex justify-center items-center">
            <SymbolIcon className="h-10 w-10 animate-spin" />
          </div>
        )}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </AuthCard>
  );
};
