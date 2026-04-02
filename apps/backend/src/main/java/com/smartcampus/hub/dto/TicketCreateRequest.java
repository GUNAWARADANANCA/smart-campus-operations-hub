package com.smartcampus.hub.dto;

import com.smartcampus.hub.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TicketCreateRequest(
    @NotBlank String title,
    String description,
    @NotBlank String category,
    @NotBlank String location,
    @NotNull TicketPriority priority,
    Long resourceId) {}
