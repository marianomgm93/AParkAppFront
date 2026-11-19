import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../data-access/reservation.service';
import { ReservationModel } from '../../data-access/reservation.model';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-reservation-list',
  styleUrl: './reservation-list.css',
  templateUrl: './reservation-list.html',
})
export default class ReservationList implements OnInit{
  private readonly reservationService = inject(ReservationService);
  readonly reservations = signal<ReservationModel[]>([]);
  ngOnInit(): void {
    this.loadReservations();
  }
  loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (data) => this.reservations.set(data),
      error: (err) => console.error('Error al listar reservas:', err),
    });
  }
  onCheckIn(id: string): void {
    this.reservationService.checkIn(id).subscribe({
      next: () => this.loadReservations(),
      error: (err) => {
        const msg = err.status === 403 ? 'No posee permisos sobre este estacionamiento.' : 'Error en check-in';
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
}
