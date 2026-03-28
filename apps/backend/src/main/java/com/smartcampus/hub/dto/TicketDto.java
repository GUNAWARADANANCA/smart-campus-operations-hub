package com.smartcampus.hub.dto;

public record TicketDto(
    String id,
    String ticketNumber,
    String title,
    String subtitle,
    String priority,
    String status,
    String reportedBy,
    String assignedTo,
    int comments,
    Long resourceId) {}
