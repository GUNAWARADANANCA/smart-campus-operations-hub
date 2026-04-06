package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.TicketCreateRequest;
import com.smartcampus.hub.dto.TicketDto;
import com.smartcampus.hub.dto.TicketStatusUpdateRequest;
import com.smartcampus.hub.exception.BadRequestException;
import com.smartcampus.hub.exception.ForbiddenException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.Ticket;
import com.smartcampus.hub.model.TicketStatus;
import com.smartcampus.hub.model.User;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.repository.TicketRepository;
import com.smartcampus.hub.service.support.DtoMapper;

import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private static final List<TicketStatus> FLOW =
            List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED);

    private final TicketRepository ticketRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TicketDto> findAll() {
        return ticketRepository.findAllByOrderByIdDesc()
                .stream()
                .map(DtoMapper::toTicketDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketDto findById(String id) {
        return ticketRepository.findById(id)
                .map(DtoMapper::toTicketDto)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    @Transactional
    public TicketDto create(TicketCreateRequest req) {
        User actor = currentUserService.requireUser();

        String placeholder = "TMP-" + UUID.randomUUID();

        Ticket entity = Ticket.builder()
                .ticketNumber(placeholder)
                .userId(actor.getId())
                .userName(actor.getName())
                .title(req.title().trim())
                .description(req.description())
                .category(req.category())
                .locationLabel(req.location())
                .priority(req.priority())
                .status(TicketStatus.OPEN)
                .commentCount(0)
                .build();

        Ticket saved = ticketRepository.save(entity);
        saved.setTicketNumber("#" + (1000 + saved.getId().hashCode()));
        saved = ticketRepository.save(saved);

        notificationService.notifyUser(
                actor,
                "Ticket Created",
                "Ticket " + saved.getTicketNumber() + " was submitted.",
                NotificationKind.INFO
        );

        return DtoMapper.toTicketDto(saved);
    }

    @Transactional
    public TicketDto advance(String id) {
        Ticket ticket = loadManaged(id);
        enforceWorkflowActor();

        TicketStatus current = ticket.getStatus();

        if (current == TicketStatus.CLOSED) {
            throw new BadRequestException("Ticket is already closed");
        }

        int idx = FLOW.indexOf(current);

        if (idx < 0 || idx >= FLOW.size() - 1) {
            throw new BadRequestException("Invalid ticket status");
        }

        ticket.setStatus(FLOW.get(idx + 1));

        Ticket saved = ticketRepository.save(ticket);
        notifyTicketWorkflow(saved);

        return DtoMapper.toTicketDto(saved);
    }

    @Transactional
    public TicketDto updateStatus(String id, TicketStatusUpdateRequest body) {
        Ticket ticket = loadManaged(id);
        enforceWorkflowActor();

        TicketStatus target = body.status();

        if (!isValidTransition(ticket.getStatus(), target)) {
            throw new BadRequestException("Invalid ticket status transition");
        }

        ticket.setStatus(target);

        Ticket saved = ticketRepository.save(ticket);
        notifyTicketWorkflow(saved);

        return DtoMapper.toTicketDto(saved);
    }

    @Transactional
    public void delete(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket not found");
        }

        if (!currentUserService.hasRole(UserRole.ADMIN)) {
            throw new ForbiddenException("Only administrators can delete tickets");
        }

        ticketRepository.deleteById(id);
    }

    private void enforceWorkflowActor() {
        if (!currentUserService.hasAnyRole(UserRole.ADMIN, UserRole.TECHNICIAN)) {
            throw new ForbiddenException("Only staff can change ticket workflow");
        }
    }

    private Ticket loadManaged(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    private boolean isValidTransition(TicketStatus from, TicketStatus to) {
        if (from == to) return true;

        int fromIdx = FLOW.indexOf(from);
        int toIdx = FLOW.indexOf(to);

        if (fromIdx < 0 || toIdx < 0) return false;

        boolean admin = currentUserService.hasRole(UserRole.ADMIN);

        if (admin) return toIdx >= fromIdx;

        return toIdx == fromIdx + 1;
    }

    private void notifyTicketWorkflow(Ticket ticket) {
        notificationService.notifyUser(
                currentUserService.requireUser(),
                "Ticket Status Updated",
                "Ticket " + ticket.getTicketNumber() + " is now " + ticket.getStatus().name(),
                NotificationKind.WARNING
        );
    }
}