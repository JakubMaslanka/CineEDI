"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { newPasswordSchema } from "@/lib/zod";

export const NewPasswordForm = () => {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data: z.infer<typeof newPasswordSchema>) => {
    if (!token) {
      setError("Nie znaleziono tokenu.");
      return;
    }
    setSuccess(undefined);
    setError(undefined);

    startTransition(() =>
      resetPasswordAction(data, token)
        .then((result) => {
          setSuccess(result?.success);
          setError(result?.error);
        })
        .catch(() => {
          setError(
            "Wystąpił niespodziewany błąd podczas weryfikacji adresu e-mail."
          );
        })
    );
  };

  return (
    <AuthCard
      title="Podaj nowe hasło"
      footerText="Powrót do logowania"
      footerHref="/auth/sign-in"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="w-full bg-cineedi hover:bg-cineedi/50 transition-colors duration-250 ease-in-out"
          >
            Zresetuj hasło
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
