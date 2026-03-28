package com.smartcampus.hub.service.support;

import com.smartcampus.hub.dto.BookingDto;
import com.smartcampus.hub.dto.ManagementUserDto;
import com.smartcampus.hub.dto.NotificationDto;
import com.smartcampus.hub.dto.ResourceDto;
import com.smartcampus.hub.dto.TicketDto;
import com.smartcampus.hub.dto.UserDto;
import com.smartcampus.hub.model.BookingEntity;
import com.smartcampus.hub.model.CampusResourceEntity;
import com.smartcampus.hub.model.NotificationEntity;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.TicketEntity;
import com.smartcampus.hub.model.UserEntity;
import com.smartcampus.hub.model.UserRole;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

public final class DtoMapper {

  private static final DateTimeFormatter DISPLAY_DATE =
      DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH);
  private static final DateTimeFormatter DISPLAY_TIME = DateTimeFormatter.ofPattern("HH:mm");
  private static final DateTimeFormatter JOINED =
      DateTimeFormatter.ofPattern("MMM d, yyyy").withZone(ZoneId.systemDefault());

  private DtoMapper() {}

  public static String str(Long id) {
    return id == null ? null : Long.toString(id);
  }

  public static UserDto toUserDto(UserEntity u) {
    return new UserDto(str(u.getId()), u.getName(), u.getEmail(), u.getRole().name());
  }

  public static ResourceDto toResourceDto(CampusResourceEntity r) {
    return new ResourceDto(
        str(r.getId()),
        r.getName(),
        r.getType(),
        r.getCapacity(),
        r.getLocation(),
        r.getStatus().name());
  }

  public static BookingDto toBookingDto(BookingEntity b) {
    var date = b.getDate();
    var start = b.getStartTime();
    var end = b.getEndTime();
    String dateTime =
        date.format(DISPLAY_DATE)
            + ", "
            + start.format(DISPLAY_TIME)
            + " - "
            + end.format(DISPLAY_TIME);
    return new BookingDto(
        str(b.getId()),
        str(b.getUser().getId()),
        str(b.getResource().getId()),
        b.getResource().getName(),
        date.toString(),
        start.toString(),
        end.toString(),
        dateTime,
        b.getPurpose(),
        b.getAttendees(),
        b.getStatus().name(),
        b.getActionNote());
  }

  public static TicketDto toTicketDto(TicketEntity t) {
    String subtitle =
        (t.getCategory() != null ? t.getCategory() : "General")
            + " • "
            + (t.getLocationLabel() != null ? t.getLocationLabel() : "—");
    String assigned = t.getAssignedTo() != null ? t.getAssignedTo().getName() : null;
    Long resourceId = t.getResource() != null ? t.getResource().getId() : null;
    return new TicketDto(
        str(t.getId()),
        t.getTicketNumber(),
        t.getTitle(),
        subtitle,
        t.getPriority().name(),
        t.getStatus().name(),
        t.getUser().getName(),
        assigned,
        t.getCommentCount(),
        resourceId);
  }

  public static NotificationDto toNotificationDto(NotificationEntity n) {
    return new NotificationDto(
        str(n.getId()),
        n.getTitle(),
        n.getMessage(),
        formatRelative(n.getCreatedAt()),
        kindApi(n.getKind()),
        n.isReadStatus());
  }

  public static ManagementUserDto toManagementUser(UserEntity u) {
    String initial = u.getName() != null && !u.getName().isEmpty()
        ? u.getName().substring(0, 1).toUpperCase(Locale.ROOT)
        : "?";
    return new ManagementUserDto(
        str(u.getId()),
        u.getName(),
        u.getEmail(),
        u.getRole().name(),
        JOINED.format(u.getCreatedAt()),
        initial,
        avatarClassForRole(u.getRole()));
  }

  private static String kindApi(NotificationKind k) {
    return switch (k) {
      case SUCCESS -> "success";
      case WARNING -> "warning";
      case INFO -> "info";
    };
  }

  private static String avatarClassForRole(UserRole r) {
    return switch (r) {
      case ADMIN -> "bg-blue-100 text-blue-700";
      case USER -> "bg-green-100 text-green-700";
      case TECHNICIAN -> "bg-yellow-100 text-yellow-700";
    };
  }

  private static String formatRelative(Instant created) {
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
