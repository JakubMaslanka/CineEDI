import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <NextTopLoader
        color="#B4151D"
        initialPosition={0.08}
        height={3}
        crawl={false}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #B4151D95,0 0 5px #B4151D50"
      />
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-8 text-white">
        {children}
      </div>
      <Toaster richColors />
      <Footer />
    </SessionProvider>
  );
};

export default DashboardLayout;
