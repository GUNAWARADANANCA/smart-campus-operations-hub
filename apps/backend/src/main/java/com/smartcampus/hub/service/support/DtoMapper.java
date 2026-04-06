package com.smartcampus.hub.service.support;

import com.smartcampus.hub.dto.BookingDto;
import com.smartcampus.hub.dto.ManagementUserDto;
import com.smartcampus.hub.dto.NotificationDto;
import com.smartcampus.hub.dto.ResourceDto;
import com.smartcampus.hub.dto.TicketDto;
import com.smartcampus.hub.dto.UserDto;
import com.smartcampus.hub.model.Booking;
import com.smartcampus.hub.model.CampusResource;
import com.smartcampus.hub.model.Notification;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.Ticket;
import com.smartcampus.hub.model.User;
import com.smartcampus.hub.model.UserRole;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

public final class DtoMapper {

    private static final DateTimeFormatter DISPLAY_DATE =
            DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH);
    private static final DateTimeFormatter DISPLAY_TIME =
            DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter JOINED =
            DateTimeFormatter.ofPattern("MMM d, yyyy").withZone(ZoneId.systemDefault());

    private DtoMapper() {
    }

    public static String str(String id) {
        return id;
    }

    public static UserDto toUserDto(User u) {
        return new UserDto(
                str(u.getId()),
                u.getName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null
        );
    }

    public static ResourceDto toResourceDto(CampusResource r) {
        return new ResourceDto(
                str(r.getId()),
                r.getName(),
                r.getType(),
                r.getCapacity(),
                r.getLocation(),
                r.getStatus() != null ? r.getStatus().name() : null
        );
    }

    public static BookingDto toBookingDto(Booking b) {
        var date = b.getDate();
        var start = b.getStartTime();
        var end = b.getEndTime();

        String dateTime = null;
        if (date != null && start != null && end != null) {
            dateTime = date.format(DISPLAY_DATE)
                    + ", "
                    + start.format(DISPLAY_TIME)
                    + " - "
                    + end.format(DISPLAY_TIME);
        }

        return new BookingDto(
                str(b.getId()),
                b.getUserId(),
                b.getResourceId(),
                b.getResourceName(),
                date != null ? date.toString() : null,
                start != null ? start.toString() : null,
                end != null ? end.toString() : null,
                dateTime,
                b.getPurpose(),
                b.getAttendees(),
                b.getStatus() != null ? b.getStatus().name() : null,
                b.getActionNote()
        );
    }

    public static TicketDto toTicketDto(Ticket t) {
        String subtitle =
                (t.getCategory() != null ? t.getCategory() : "General")
                        + " • "
                        + (t.getLocationLabel() != null ? t.getLocationLabel() : "—");

        return new TicketDto(
                str(t.getId()),
                t.getTicketNumber(),
                t.getTitle(),
                subtitle,
                t.getPriority() != null ? t.getPriority().name() : null,
                t.getStatus() != null ? t.getStatus().name() : null,
                t.getUserName(),
                t.getAssignedToName(),
                t.getCommentCount(),
                t.getResourceId()
        );
    }

    public static NotificationDto toNotificationDto(Notification n) {
        return new NotificationDto(
                str(n.getId()),
                n.getTitle(),
                n.getMessage(),
                formatRelative(n.getCreatedAt()),
                kindApi(n.getKind()),
                n.isReadStatus()
        );
    }

    public static ManagementUserDto toManagementUser(User u) {
        String initial = u.getName() != null && !u.getName().isEmpty()
                ? u.getName().substring(0, 1).toUpperCase(Locale.ROOT)
                : "?";

        return new ManagementUserDto(
                str(u.getId()),
                u.getName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null,
                u.getCreatedAt() != null ? JOINED.format(u.getCreatedAt()) : "",
                initial,
                avatarClassForRole(u.getRole())
        );
    }

    private static String kindApi(NotificationKind k) {
        if (k == null) {
            return "info";
        }

        return switch (k) {
            case SUCCESS -> "success";
            case WARNING -> "warning";
            case INFO -> "info";
        };
    }

    private static String avatarClassForRole(UserRole r) {
        if (r == null) {
            return "bg-gray-100 text-gray-700";
        }

        return switch (r) {
            case ADMIN -> "bg-blue-100 text-blue-700";
            case USER -> "bg-green-100 text-green-700";
            case TECHNICIAN -> "bg-yellow-100 text-yellow-700";
        };
    }

    private static String formatRelative(Instant created) {
        if (created == null) {
            return "Just now";
        }

        long minutes = ChronoUnit.MINUTES.between(created, Instant.now());
        if (minutes < 1) {
            return "Just now";
        }
        if (minutes < 60) {
            return minutes + " minutes ago";
        }

        long hours = minutes / 60;
        if (hours < 24) {
            return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        }

        long days = hours / 24;
        return days + " day" + (days == 1 ? "" : "s") + " ago";
    }
}