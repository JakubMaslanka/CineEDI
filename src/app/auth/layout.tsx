import { BackgroundBeams } from "@/components/ui/background-beams";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-svh flex items-center justify-center">{children}</div>
      <BackgroundBeams />
    </>
  );
};

export default AuthLayout;
