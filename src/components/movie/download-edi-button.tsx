"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

export const DownloadEdiButton = () => {
  const handleDownloadEdiFile = () => {
    console.log("Downloading EDI file...");
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
