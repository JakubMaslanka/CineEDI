import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const FormError = ({
  message,
  isNotVerifiedEmailMessage = false,
  onEmailResend,
}: {
  message?: string;
  isNotVerifiedEmailMessage?: boolean;
  onEmailResend?: () => void;
}) => {
  if (!message) return null;

  return (
    <>
      <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
        <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
        <p>{message}</p>
      </div>
      {isNotVerifiedEmailMessage && (
        <Button
          onClick={onEmailResend}
          variant="link"
          size="sm"
          className="!mt-0 !p-0 font-normal mx-auto w-full text-neutral-300"
        >
          Wyślij ponowanie email weryfikacyjny
        </Button>
      )}
    </>
  );
};
