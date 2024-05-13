import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { signOut } from "@/lib/auth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const handleSignOut = async () => {
    "use server";

    await signOut({ redirectTo: "/" });
  };

  return (
    <SessionProvider>
      <Navbar onSignOutAction={handleSignOut} />
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-8 text-white">
        {children}
      </div>
      <Toaster richColors />
      <Footer />
    </SessionProvider>
  );
};

export default DashboardLayout;
