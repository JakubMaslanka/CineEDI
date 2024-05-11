"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmailVerifyLinkAction, signInAction } from "@/actions/auth";
import { signInSchema } from "@/lib/zod";
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

const DEFAULT_NOT_VERIFIED_EMAIL_MESSAGE = "Email nie został zweryfikowany!";

export const SignInForm = () => {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    setSuccess(undefined);
    setError(undefined);

    startTransition(() =>
      signInAction(data, callbackUrl).then((result) => {
        setSuccess(result?.success);
        setError(result?.error);
      })
    );
  };

  const handleVerificationEmailResend = () => {
    setSuccess(undefined);
    setError(undefined);
    const currentEmail = form.getValues().email;

    startTransition(() =>
      sendEmailVerifyLinkAction(currentEmail).then((result) => {
        setSuccess(result?.success);
        setError(result?.error);
      })
    );
  };

  return (
    <AuthCard
      title="Zaloguj się do cineEDI"
      footerText="Nie posiadasz konta?"
      footerHref="/auth/sign-up"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="email"
                      placeholder="jan.kowalski@przykład.pl"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="!mt-0 !p-0 font-normal text-neutral-100"
                  >
                    <Link href="/auth/reset-password">Zapomniałeś hasło?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <FormError
            message={error}
            isNotVerifiedEmailMessage={
              error === DEFAULT_NOT_VERIFIED_EMAIL_MESSAGE
            }
            onEmailResend={handleVerificationEmailResend}
          />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="w-full bg-cineedi hover:bg-cineedi/50 transition-colors duration-250 ease-in-out"
          >
            Zaloguj się
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
