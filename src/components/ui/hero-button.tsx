"use client";

import { useEffect, useTransition, type ButtonHTMLAttributes } from "react";
import { clearAuthCookiesAction } from "@/actions/auth";

interface HeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HeroButton = ({ children }: HeroButtonProps) => {
  const [_, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setTimeout(() => {
        clearAuthCookiesAction();
      }, 1000);
    });
  }, []);

  return (
    <button className="px-4 py-2 rounded-md border border-cineedi bg-destructive/50 text-white text-neutarl-700 shadow-none text-sm font-bold font-sans uppercase hover:shadow-[4px_4px_0px_0px_rgba(180,21,29,1)] shadow-cineedi transition duration-200">
      {children}
    </button>
  );
};

HeroButton.displayName = "HeroButton";

export { HeroButton };
