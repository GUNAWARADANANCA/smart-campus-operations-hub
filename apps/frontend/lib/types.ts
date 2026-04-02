export type Role = "USER" | "ADMIN" | "TECHNICIAN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type ResourceStatus = "ACTIVE" | "OUT_OF_SERVICE";

export type ResourceType =
  | "Lecture Hall"
  | "Lab"
  | "Meeting Room"
  | "Equipment";

export type ResourceAccent = "blue" | "purple" | "green" | "orange";

export type ResourceIconKind =
  | "building"
  | "lab"
  | "meeting"
  | "projector"
  | "camera";

export interface Resource {
  id: string;
  name: string;
  location: string;
  type: ResourceType;
  capacityLabel: string;
  status: ResourceStatus;
  accent: ResourceAccent;
  icon: ResourceIconKind;
}

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface Booking {
  id: string;
  resourceName: string;
  dateTime: string;
  purpose: string;
  attendees: number;
  status: BookingStatus;
  actionNote?: string;
}

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Ticket {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  priority: TicketPriority;
  status: TicketStatus;
  reportedBy: string;
  assignedTo: string | null;
  comments: number;
}

export type NotificationKind = "success" | "warning" | "info";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: NotificationKind;
  read: boolean;
}

export interface ManagementUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined: string;
  initial: string;
  avatarClass: string;
}
