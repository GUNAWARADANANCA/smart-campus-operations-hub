package com.smartcampus.hub.dto;

import com.smartcampus.hub.model.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
    @NotNull BookingStatus status, String actionNote) {}
