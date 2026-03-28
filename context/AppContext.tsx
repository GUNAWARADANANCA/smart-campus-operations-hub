"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialBookings,
  initialManagementUsers,
  initialNotifications,
  initialResources,
  initialTickets,
} from "@/lib/dummyData";
import type {
  Booking,
  BookingStatus,
  ManagementUser,
  NotificationItem,
  Resource,
  Ticket,
  TicketStatus,
} from "@/lib/types";

type AppContextValue = {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  advanceTicketStatus: (id: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  managementUsers: ManagementUser[];
  setManagementUsers: React.Dispatch<React.SetStateAction<ManagementUser[]>>;
  toastMessage: string | null;
  showToast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const TICKET_FLOW: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [managementUsers, setManagementUsers] = useState<ManagementUser[]>(
    initialManagementUsers,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  }, []);

  const advanceTicketStatus = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = TICKET_FLOW.indexOf(t.status);
        const next = TICKET_FLOW[Math.min(idx + 1, TICKET_FLOW.length - 1)];
        return { ...t, status: next };
      }),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo(
    () => ({
      resources,
      setResources,
      bookings,
      setBookings,
      updateBookingStatus,
      tickets,
      setTickets,
      advanceTicketStatus,
      notifications,
      markAllNotificationsRead,
      managementUsers,
      setManagementUsers,
      toastMessage,
      showToast,
    }),
    [
      resources,
      bookings,
      tickets,
      notifications,
      managementUsers,
      toastMessage,
      showToast,
      updateBookingStatus,
      advanceTicketStatus,
      markAllNotificationsRead,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
