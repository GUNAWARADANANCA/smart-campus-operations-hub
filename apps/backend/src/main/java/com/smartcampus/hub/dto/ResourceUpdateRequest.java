package com.smartcampus.hub.dto;

import com.smartcampus.hub.model.ResourceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResourceUpdateRequest(
    @NotBlank String name,
    @NotBlank String type,
    Integer capacity,
    @NotBlank String location,
    @NotNull ResourceStatus status) {}
