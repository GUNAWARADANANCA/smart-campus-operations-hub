package com.smartcampus.hub.dto;

import com.smartcampus.hub.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusUpdateRequest(@NotNull TicketStatus status) {}
