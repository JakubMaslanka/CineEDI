"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { formatRelative } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "sonner";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  Eye,
  LoaderCircleIcon,
  MessageSquareDot,
} from "lucide-react";
import { type Notifications } from "@/lib/db.schema";
import { cn } from "@/utils/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { markNotificationAsSeenAction } from "@/actions/notifications";

export const NotificationButton = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<number>();
  const [
    isMarkNotificationAsSeenActionPending,
    startMarkNotificationAsSeenTransition,
  ] = useTransition();

  const markNotificationAsSeen = (notificationId: number) => {
    startMarkNotificationAsSeenTransition(() => {
      markNotificationAsSeenAction(notificationId)
        .then((result) => {
          if (result.updatedNotifications)
            setNotifications(result.updatedNotifications);
          if (result.error) toast.error(result.error);
        })
        .catch(() => {
          toast.error("Wystąpił błąd podczas aktualizowania powiadomień!");
        })
        .finally(() => setSelectedNotification(undefined));
    });
  };

  const atLeastOneNotificationNotSeen = useMemo(() => {
    return notifications.some((notification) => notification.status === "sent");
  }, [notifications]);

  useEffect(() => {
    fetch("/api/user/notifications", { next: { tags: ["notifications"] } })
      .then((res) =>
        res
          .json()
          .then(({ notifications }: { notifications: Notifications[] }) => {
            setNotifications(notifications);
          })
      )
      .catch(() => {
        toast.error("Wystąpił błąd podczas pobierania powiadomień!");
      });
  }, []);

  return (
    <Menu as="div" className="relative z-10">
      <div className="relative flex">
        {atLeastOneNotificationNotSeen && (
          <span className="absolute top-0 left-0 z-10 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cineedi opacity-85"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cineedi"></span>
          </span>
        )}
        <Menu.Button
          type="button"
          className="relative flex rounded-full bg-zinc-950 p-1 text-gray-200 hover:text-cineedi/80 focus:outline-none focus:ring-2 focus:ring-cineedi/50"
        >
          <span className="sr-only">Otworz powiadomienia</span>
          <BellIcon className="h-6 w-6 p-0.5" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        enter="transition ease-out duration-200 z-40"
        enterFrom="transform opacity-0 scale-95 z-40"
        enterTo="transform opacity-100 scale-100 z-40"
        leave="transition ease-in duration-75 z-40"
        leaveFrom="transform opacity-100 scale-100 z-40"
        leaveTo="transform opacity-0 scale-95 z-40"
      >
        <Menu.Items
          static
          className="absolute right-0 z-40 overflow-x-hidden overflow-y-scroll mt-2 w-96 max-h-80 origin-top-right rounded-md bg-neutral-950/95 border border-zinc-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <h3 className="text-md font-bold py-2 text-center text-neutral-200">
            Powiadomienia
          </h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Menu.Item
                key={notification.id}
                disabled={notification.status === "received"}
              >
                <div
                  className={cn(
                    "flex gap-3 p-3 items-center border-t border-b border-neutral-400",
                    notification.status === "received" && "opacity-60"
                  )}
                >
                  {notification.status === "received" ? (
                    <button
                      disabled
                      className="bg-cineedi/60 opacity-85 text-neutral-100 h-8 w-12 rounded-md shadow-xl"
                    >
                      <Eye className="flex-shrink-0 h-4 w-4 mx-auto" />
                    </button>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          disabled={
                            selectedNotification === notification.id &&
                            isMarkNotificationAsSeenActionPending
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            setSelectedNotification(notification.id);
                            markNotificationAsSeen(notification.id);
                          }}
                          className="bg-cineedi text-neutral-100 h-8 w-12 rounded-md shadow-xl hover:bg-cineedi/80 transition-colors duration-200 ease-in-out"
                        >
                          {selectedNotification === notification.id &&
                          isMarkNotificationAsSeenActionPending ? (
                            <LoaderCircleIcon className="animate-spin flex-shrink-0 h-4 w-4 mx-auto" />
                          ) : (
                            <MessageSquareDot className="flex-shrink-0 h-4 w-4 mx-auto" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Oznacz jako przeczytane</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <div className="flex flex-col">
                    <p className="text-neutral-100 font-bold text-sm">
                      {notification.message}
                    </p>
                    <p className="text-neutral-500 font-normal text-xs">
                      {formatRelative(
                        notification.notification_date!,
                        new Date(),
                        {
                          locale: pl,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </Menu.Item>
            ))
          ) : (
            <p className="text-sm font-bold py-2 text-center text-neutral-400">
              Brak nowych powiadomień 🎉
            </p>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
