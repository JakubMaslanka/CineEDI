"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface DownloadEdiButtonProps {
  rentId: number;
  ediData: string;
}

export const DownloadEdiButton = ({
  rentId,
  ediData,
}: DownloadEdiButtonProps) => {
  const handleDownloadEdiFile = () => {
    if (!ediData) {
      toast.error(
        "Ops! Coś poszło nie tak podczas pobierania dokumentu transakcji."
      );
      return;
    }

    const blob = new Blob([ediData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transaction_${rentId}.edi`;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <Button
      className="bg-cineedi hover:bg-cineedi/80"
      onClick={handleDownloadEdiFile}
    >
      <>
        <DownloadIcon
          className="mr-2 h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
        <span>Pobierz dokument transakcji</span>
      </>
    </Button>
  );
};
