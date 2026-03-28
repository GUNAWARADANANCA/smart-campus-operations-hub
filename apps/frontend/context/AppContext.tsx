"use client";

import { apiFetch } from "@/lib/api";
import type {
  ApiBooking,
  ApiManagementUser,
  ApiNotification,
  ApiResource,
  ApiTicket,
} from "@/lib/mappers";
import {
  mapBooking,
  mapManagementUser,
  mapNotification,
  mapResource,
  mapTicket,
} from "@/lib/mappers";
import type {
  Booking,
  BookingStatus,
  ManagementUser,
  NotificationItem,
  Resource,
  ResourceStatus,
  ResourceType,
  Ticket,
} from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CreateResourceInput = {
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  status: ResourceStatus;
};

type CreateBookingInput = {
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
};

type CreateTicketInput = {
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  resourceId: string | null;
};

type AppContextValue = {
  resources: Resource[];
  bookings: Booking[];
  tickets: Ticket[];
  notifications: NotificationItem[];
  managementUsers: ManagementUser[];
  dataLoaded: boolean;
  refreshAll: () => Promise<void>;
  createResource: (input: CreateResourceInput) => Promise<void>;
  createBooking: (input: CreateBookingInput) => Promise<void>;
  createTicket: (input: CreateTicketInput) => Promise<void>;
  updateBookingStatus: (
    id: string,
    status: BookingStatus,
    actionNote?: string,
  ) => Promise<void>;
  advanceTicketStatus: (id: string) => Promise<void>;
  updateUserRole: (id: string, role: ManagementUser["role"]) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  toastMessage: string | null;
  showToast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userEmail = user?.email ?? null;
  const isAdmin = user?.role === "ADMIN";

  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [managementUsers, setManagementUsers] = useState<ManagementUser[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const refreshResources = useCallback(async () => {
    if (!userEmail) return;
    const raw = await apiFetch<ApiResource[]>("/resources", { userEmail });
    setResources((raw ?? []).map(mapResource));
  }, [userEmail]);

  const refreshBookings = useCallback(async () => {
    if (!userEmail) return;
    const raw = await apiFetch<ApiBooking[]>("/bookings", { userEmail });
    setBookings((raw ?? []).map(mapBooking));
  }, [userEmail]);

  const refreshTickets = useCallback(async () => {
    if (!userEmail) return;
    const raw = await apiFetch<ApiTicket[]>("/tickets", { userEmail });
    setTickets((raw ?? []).map(mapTicket));
  }, [userEmail]);

  const refreshNotifications = useCallback(async () => {
    if (!userEmail) return;
    const raw = await apiFetch<ApiNotification[]>("/notifications", { userEmail });
    setNotifications((raw ?? []).map(mapNotification));
  }, [userEmail]);

  const refreshManagementUsers = useCallback(async () => {
    if (!userEmail || !isAdmin) {
      setManagementUsers([]);
      return;
    }
    const raw = await apiFetch<ApiManagementUser[]>("/users", { userEmail });
    setManagementUsers((raw ?? []).map(mapManagementUser));
  }, [userEmail, isAdmin]);

  const refreshAll = useCallback(async () => {
    if (!userEmail) return;
    setDataLoaded(false);
    try {
      await Promise.all([
        refreshResources(),
        refreshBookings(),
        refreshTickets(),
        refreshNotifications(),
        refreshManagementUsers(),
      ]);
    } catch {
      showToast("Could not load data. Is the API running on port 8080?");
    } finally {
      setDataLoaded(true);
    }
  }, [
    userEmail,
    refreshResources,
    refreshBookings,
    refreshTickets,
    refreshNotifications,
    refreshManagementUsers,
    showToast,
  ]);

  useEffect(() => {
    if (!userEmail) {
      setResources([]);
      setBookings([]);
      setTickets([]);
      setNotifications([]);
      setManagementUsers([]);
      setDataLoaded(false);
      return;
    }
    let active = true;
    (async () => {
      setDataLoaded(false);
      try {
        const opts = { userEmail };
        const [r, b, t, n] = await Promise.all([
          apiFetch<ApiResource[]>("/resources", opts),
          apiFetch<ApiBooking[]>("/bookings", opts),
          apiFetch<ApiTicket[]>("/tickets", opts),
          apiFetch<ApiNotification[]>("/notifications", opts),
        ]);
        if (!active) return;
        setResources((r ?? []).map(mapResource));
        setBookings((b ?? []).map(mapBooking));
        setTickets((t ?? []).map(mapTicket));
        setNotifications((n ?? []).map(mapNotification));
        if (isAdmin) {
          const mu = await apiFetch<ApiManagementUser[]>("/users", opts);
          if (!active) return;
          setManagementUsers((mu ?? []).map(mapManagementUser));
        } else {
          setManagementUsers([]);
        }
      } catch {
        if (active) {
          showToast("Could not load data. Is the API running on port 8080?");
        }
      } finally {
        if (active) setDataLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [userEmail, isAdmin, showToast]);

  const createResource = useCallback(
    async (input: CreateResourceInput) => {
      if (!userEmail) return;
      await apiFetch("/resources", {
        method: "POST",
        userEmail,
        body: JSON.stringify({
          name: input.name,
          type: input.type,
          capacity: input.capacity,
          location: input.location,
          status: input.status,
        }),
      });
      await refreshResources();
    },
    [userEmail, refreshResources],
  );

  const createBooking = useCallback(
    async (input: CreateBookingInput) => {
      if (!userEmail) return;
      await apiFetch("/bookings", {
        method: "POST",
        userEmail,
        body: JSON.stringify({
          resourceId: Number(input.resourceId),
          date: input.date,
          startTime: input.startTime.length === 5 ? `${input.startTime}:00` : input.startTime,
          endTime: input.endTime.length === 5 ? `${input.endTime}:00` : input.endTime,
          purpose: input.purpose,
          attendees: input.attendees,
        }),
      });
      await refreshBookings();
      await refreshNotifications();
    },
    [userEmail, refreshBookings, refreshNotifications],
  );

  const createTicket = useCallback(
    async (input: CreateTicketInput) => {
      if (!userEmail) return;
      const body: Record<string, unknown> = {
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location,
        priority: input.priority,
      };
      if (input.resourceId) {
        body.resourceId = Number(input.resourceId);
      }
      await apiFetch("/tickets", {
        method: "POST",
        userEmail,
        body: JSON.stringify(body),
      });
      await refreshTickets();
      await refreshNotifications();
    },
    [userEmail, refreshTickets, refreshNotifications],
  );

  const updateBookingStatus = useCallback(
    async (id: string, status: BookingStatus, actionNote?: string) => {
      if (!userEmail) return;
      await apiFetch(`/bookings/${id}/status`, {
        method: "PUT",
        userEmail,
        body: JSON.stringify({ status, actionNote: actionNote ?? null }),
      });
      await refreshBookings();
      await refreshNotifications();
    },
    [userEmail, refreshBookings, refreshNotifications],
  );

  const advanceTicketStatus = useCallback(
    async (id: string) => {
      if (!userEmail) return;
      await apiFetch(`/tickets/${id}/advance`, {
        method: "PATCH",
        userEmail,
      });
      await refreshTickets();
      await refreshNotifications();
    },
    [userEmail, refreshTickets, refreshNotifications],
  );

  const updateUserRole = useCallback(
    async (id: string, role: ManagementUser["role"]) => {
      if (!userEmail) return;
      await apiFetch(`/users/${id}/role`, {
        method: "PUT",
        userEmail,
        body: JSON.stringify({ role }),
      });
      await refreshManagementUsers();
    },
    [userEmail, refreshManagementUsers],
  );

  const markAllNotificationsRead = useCallback(async () => {
    if (!userEmail) return;
    await apiFetch("/notifications/read-all", { method: "PUT", userEmail });
    await refreshNotifications();
  }, [userEmail, refreshNotifications]);

  const value = useMemo(
    () => ({
      resources,
      bookings,
      tickets,
      notifications,
      managementUsers,
      dataLoaded,
      refreshAll,
      createResource,
      createBooking,
      createTicket,
      updateBookingStatus,
      advanceTicketStatus,
      updateUserRole,
      markAllNotificationsRead,
      toastMessage,
      showToast,
    }),
    [
      resources,
      bookings,
      tickets,
      notifications,
      managementUsers,
      dataLoaded,
      refreshAll,
      createResource,
      createBooking,
      createTicket,
      updateBookingStatus,
      advanceTicketStatus,
      updateUserRole,
      markAllNotificationsRead,
      toastMessage,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
