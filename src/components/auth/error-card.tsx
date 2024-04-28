import { AuthCard } from "./auth-card";

export const ErrorCard = () => (
  <AuthCard title="" footerText="Wróć do logowania" footerHref="/auth/sign-in">
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <p className="font-medium text-xl">
        Wygląda na to, że coś poszło nie tak podczas próby autoryzacji.
      </p>
      <p className="font-light text-xs">Proszę, spróbuj ponowanie później.</p>
    </div>
  </AuthCard>
);
