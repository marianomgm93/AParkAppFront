import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservationService } from '../../data-access/reservation.service';
import { AuthService } from '../../../auth/auth-service';
import { ReservationModel } from '../../data-access/reservation.model';
import { DatePipe } from '@angular/common';
import { ROUTE_COMMANDS } from '../../../app.route.segments';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-reservation-detail',
  styleUrl: './reservation-detail.css',
  templateUrl: './reservation-detail.html',
})
export default class ReservationDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reservationService = inject(ReservationService);
  protected readonly authService = inject(AuthService);
  protected readonly commands = ROUTE_COMMANDS;
  readonly reservation = signal<ReservationModel | undefined>(undefined);
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reservationService.getById(id).subscribe({
        next: (data) => this.reservation.set(data),
        error: (err) => alert(err.error?.message || 'Error al cargar detalle'),
      });
    }
  }
}