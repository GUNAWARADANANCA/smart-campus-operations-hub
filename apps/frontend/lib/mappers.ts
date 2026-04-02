import type {
  Booking,
  ManagementUser,
  NotificationItem,
  Resource,
  ResourceAccent,
  ResourceIconKind,
  ResourceType,
  Ticket,
} from "@/lib/types";

export type ApiResource = {
  id: string;
  name: string;
  type: string;
  capacity: number | null;
  location: string;
  status: string;
};

export type ApiBooking = {
  id: string;
  resourceName: string;
  dateTime: string;
  purpose: string;
  attendees: number | null;
  status: string;
  actionNote?: string | null;
};

export type ApiTicket = {
  id: string;
  ticketNumber: string;
  title: string;
  subtitle: string;
  priority: string;
  status: string;
  reportedBy: string;
  assignedTo: string | null;
  comments: number;
};

export type ApiNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: string;
  read: boolean;
};

export type ApiManagementUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  initial: string;
  avatarClass: string;
};

const RESOURCE_TYPES: ResourceType[] = [
  "Lecture Hall",
  "Lab",
  "Meeting Room",
  "Equipment",
];

function asResourceType(type: string): ResourceType {
  if (RESOURCE_TYPES.includes(type as ResourceType)) {
    return type as ResourceType;
  }
  return "Equipment";
}

function accentForType(type: string): ResourceAccent {
  switch (type) {
    case "Lecture Hall":
      return "blue";
    case "Lab":
      return "purple";
    case "Meeting Room":
      return "green";
    case "Equipment":
    default:
      return "orange";
  }
}

function iconForType(type: string): ResourceIconKind {
  switch (type) {
    case "Lecture Hall":
      return "building";
    case "Lab":
      return "lab";
    case "Meeting Room":
      return "meeting";
    case "Equipment":
    default:
      return "projector";
  }
}

export function mapResource(d: ApiResource): Resource {
  const t = asResourceType(d.type);
  const cap = d.capacity ?? 0;
  const capacityLabel =
    t === "Equipment" && cap === 0 ? "Portable" : `Capacity: ${cap}`;
  return {
    id: d.id,
    name: d.name,
    location: d.location,
    type: t,
    capacityLabel,
    status: d.status as Resource["status"],
    accent: accentForType(t),
    icon: iconForType(t),
  };
}

export function mapBooking(d: ApiBooking): Booking {
  return {
    id: d.id,
    resourceName: d.resourceName,
    dateTime: d.dateTime,
    purpose: d.purpose ?? "",
    attendees: d.attendees ?? 0,
    status: d.status as Booking["status"],
    actionNote: d.actionNote ?? undefined,
  };
}

export function mapTicket(d: ApiTicket): Ticket {
  return {
    id: d.id,
    number: d.ticketNumber,
    title: d.title,
    subtitle: d.subtitle,
    priority: d.priority as Ticket["priority"],
    status: d.status as Ticket["status"],
    reportedBy: d.reportedBy,
    assignedTo: d.assignedTo,
    comments: d.comments,
  };
}

export function mapNotification(d: ApiNotification): NotificationItem {
  return {
    id: d.id,
    title: d.title,
    body: d.body,
    time: d.time,
    kind: d.kind as NotificationItem["kind"],
    read: d.read,
  };
}

export function mapManagementUser(d: ApiManagementUser): ManagementUser {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    role: d.role as ManagementUser["role"],
    joined: d.joined,
    initial: d.initial,
    avatarClass: d.avatarClass,
  };
}
