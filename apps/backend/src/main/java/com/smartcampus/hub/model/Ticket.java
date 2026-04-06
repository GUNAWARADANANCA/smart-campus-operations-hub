package com.smartcampus.hub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    private String id;

    private String ticketNumber;

    private String userId;
    private String userName;

    private String resourceId;
    private String resourceName;

    private String title;
    private String description;
    private String category;
    private String locationLabel;

    private TicketPriority priority;
    private TicketStatus status;

    private String assignedToId;
    private String assignedToName;

    private int commentCount;
}