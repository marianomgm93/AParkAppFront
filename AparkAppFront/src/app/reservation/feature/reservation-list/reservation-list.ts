import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../data-access/reservation.service';
import { ReservationModel } from '../../data-access/reservation.model';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth-service';
import { RouterLink } from '@angular/router';
import { ROUTE_COMMANDS } from '../../../app.route.segments';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-reservation-list',
  styleUrl: './reservation-list.css',
  templateUrl: './reservation-list.html',
})
export default class ReservationList implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);
  readonly userRole = this.authService.userRole;
  readonly reservations = signal<ReservationModel[]>([]);
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly statusFilter = signal<'ALL' | ReservationModel['status']>('ALL');
  protected readonly commands= ROUTE_COMMANDS;
  readonly statusLabels: Record<'ALL' | ReservationModel['status'], string> = {
    ALL: 'Todos',
    RESERVED: 'Reservadas',
    CHECKED_IN: 'En curso',
    COMPLETED: 'Completadas',
    CANCELLED: 'Canceladas',
  };

  readonly filteredAndSortedReservations = computed(() => {
    const filter = this.statusFilter();
    const order = this.sortOrder();

    const filtered = filter === 'ALL'
      ? this.reservations()
      : this.reservations().filter((res) => res.status === filter);

    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return order === 'asc' ? timeA - timeB : timeB - timeA;
    });
  });

  cycleStatusFilter(): void {
    const options: Array<'ALL' | ReservationModel['status']> = [
      'ALL',
      'RESERVED',
      'CHECKED_IN',
      'COMPLETED',
      'CANCELLED',
    ];
    const nextIdx = (options.indexOf(this.statusFilter()) + 1) % options.length;
    this.statusFilter.set(options[nextIdx]);
  }

  toggleSort(): void {
    this.sortOrder.update((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }
  
  ngOnInit(): void {
    this.loadReservations();
  }
  loadReservations(): void {
    const fetch$ =
      this.userRole() === 'ROLE_CLIENT'
        ? this.reservationService.getMyReservations()
        : this.reservationService.getAll();
    fetch$.subscribe({
      next: (data) => this.reservations.set(data),
      error: (err) => console.error('Error al listar reservas:', err),
    });
  }
  onCheckIn(id: string): void {
    this.reservationService.checkIn(id).subscribe({
      next: () => this.loadReservations(),
      error: (err) => {
        const msg =
          err.status === 403
            ? 'No posee permisos sobre este estacionamiento.'
            : 'Error en check-in';
        alert(msg);
      },
    });
  }
  onCheckOut(id: string): void {
    this.reservationService.checkOut(id).subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error('Error en check-out:', err),
    });
  }
  onCancel(id: string): void {
    if (!confirm('¿Confirma la cancelación de esta reserva?')) return;
    this.reservationService.cancel(id).subscribe({
      next: () => this.loadReservations(),
      error: (err) => alert(err.error?.message || 'Error al cancelar la reserva'),
    });
  }
}
