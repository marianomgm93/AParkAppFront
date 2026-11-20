import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingSpotService } from '../../data-access/spot-client';
import { ParkingSpotModel } from '../../data-access/spot-model';
import { AuthService } from '../../../auth/auth-service';
import { ReservationService } from '../../../reservation/data-access/reservation.service';
import { ReservationModel } from '../../../reservation/data-access/reservation.model';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-spot-list',
  styleUrl: './spot-catalog.css',
  templateUrl: './spot-catalog.html',
})
export default class SpotCatalog implements OnInit {
  private readonly service = inject(ParkingSpotService);
  private readonly reservationService = inject(ReservationService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly spots = signal<ParkingSpotModel[]>([]);
  private readonly reservations = signal<ReservationModel[]>([]);

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => {
    const role = this.userRole();
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  });
  readonly isOwner = computed(() => {
    const role = this.userRole();
    return role === 'ROLE_OWNER' || role === 'OWNER';
  });
  readonly isClient = computed(() => {
    const role = this.userRole();
    return role === 'ROLE_CLIENT' || role === 'CLIENT';
  });

  // Mapa spotId -> reserva activa ('RESERVED' | 'CHECKED_IN')
  readonly activeReservationBySpot = computed(() => {
    const map = new Map<string, ReservationModel>();
    for (const res of this.reservations()) {
      if (
        res.parkingSpotId &&
        (res.status === 'RESERVED' || res.status === 'CHECKED_IN')
      ) {
        map.set(String(res.parkingSpotId), res);
      }
    }
    return map;
  });

  readonly sortedSpots = computed(() =>
    [...this.spots()].sort((a, b) => a.number - b.number)
  );

  ngOnInit() {
    this.loadSpots();
    this.loadActiveReservations();
  }

  loadSpots() {
    this.service.getAllParkingSpots().subscribe({
      next: (list) => this.spots.set(list),
      error: (err) => console.error('Error al cargar lugares:', err),
    });
  }

  private loadActiveReservations() {
    // GET /reservation en backend requiere roles OWNER/EMPLOYEE; evitamos llamar si es CLIENT
    if (this.isClient()) {
      return;
    }
    this.reservationService.getAll().subscribe({
      next: (list) => this.reservations.set(list),
      error: (err) => console.warn('No se pudieron cargar reservas para los lugares:', err),
    });
  }

  getActiveReservation(spotId: string): ReservationModel | undefined {
    return this.activeReservationBySpot().get(String(spotId));
  }

  viewDetail(id: string) {
    this.router.navigate(['/parking-spot/parking-spot-detail', id]);
  }

  edit(id: string) {
    this.router.navigate(['/parking-spot/parking-spot-form', id]);
  }

  toggleActive(spot: ParkingSpotModel) {
    if (spot.active) {
      if (!confirm(`¿Dar de baja el lugar "${spot.name}" (N° ${spot.number})?`)) return;
      this.service.deleteParkingSpot(spot.id).subscribe({
        next: () =>
          this.spots.update((list) =>
            list.map((s) => (s.id === spot.id ? { ...s, active: false, status: 'FREE' } : s))
          ),
        error: (err) =>
          alert('Error al dar de baja: ' + (err?.error?.message || err?.message)),
      });
    } else {
      if (!confirm(`¿Dar de alta el lugar "${spot.name}" (N° ${spot.number})?`)) return;
      this.service.restoreParkingSpot(spot.id).subscribe({
        next: () =>
          this.spots.update((list) =>
            list.map((s) => (s.id === spot.id ? { ...s, active: true, status: 'FREE' } : s))
          ),
        error: (err) =>
          alert('Error al dar de alta: ' + (err?.error?.message || err?.message)),
      });
    }
  }

  occupySpot(spot: ParkingSpotModel) {
    if (!confirm(`¿Marcar el lugar "${spot.name}" como OCUPADO?`)) return;
    this.service.occupyParkingSpot(spot.id).subscribe({
      next: () =>
        this.spots.update((list) =>
          list.map((s) => (s.id === spot.id ? { ...s, active: true, status: 'OCCUPIED' } : s))
        ),
      error: (err) =>
        alert('Error al ocupar lugar: ' + (err?.error?.message || err?.message)),
    });
  }

  releaseSpot(spot: ParkingSpotModel) {
    const activeRes = this.getActiveReservation(spot.id);
    if (activeRes?.status === 'CHECKED_IN') {
      alert(
        `Este lugar tiene una reserva en curso (Patente: ${activeRes.vehiclePlate ?? activeRes.vehicleId}). Realizá el check-out desde Reservas.`
      );
      return;
    }

    if (!confirm(`¿Liberar el lugar "${spot.name}"?`)) return;
    this.service.releaseParkingSpot(spot.id).subscribe({
      next: () => {
        // ParkingSpotService.release en backend marca status = FREE y active = false
        this.spots.update((list) =>
          list.map((s) => (s.id === spot.id ? { ...s, status: 'FREE', active: false } : s))
        );
        this.loadActiveReservations();
      },
      error: (err) =>
        alert('Error al liberar lugar: ' + (err?.error?.message || err?.message)),
    });
  }
}