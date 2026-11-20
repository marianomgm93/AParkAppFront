import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkingSpotService } from '../../data-access/spot-client';
import { ParkingSpotModel } from '../../data-access/spot-model';
import { ReservationService } from '../../../reservation/data-access/reservation.service';
import { ReservationModel } from '../../../reservation/data-access/reservation.model';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/auth-service';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-spot-detail',
  styleUrl: './spot-details.css',
  templateUrl: './spot-details.html',
})
export default class ParkingSpotDetail implements OnInit {
  private readonly service = inject(ParkingSpotService);
  private readonly reservationService = inject(ReservationService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly spot = signal<ParkingSpotModel | undefined>(undefined);
  readonly activeReservation = signal<ReservationModel | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal<string | undefined>(undefined);

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

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID no encontrado.');
      this.loading.set(false);
      return;
    }
    try {
      const data = await firstValueFrom(this.service.getParkingSpotById(id));
      this.spot.set(data);
      await this.loadActiveReservationForSpot(data.id);
    } catch {
      this.error.set('No se pudo cargar el lugar de estacionamiento.');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadActiveReservationForSpot(spotId: string) {
    if (this.isClient()) {
      return;
    }
    try {
      const all = await firstValueFrom(this.reservationService.getAll());
      const current = all.find(
        (r) =>
          String(r.parkingSpotId) === String(spotId) &&
          (r.status === 'RESERVED' || r.status === 'CHECKED_IN')
      );
      this.activeReservation.set(current);
    } catch {
      // No bloquea la vista de detalle si falla la consulta auxiliar
    }
  }

  occupySpot() {
    const s = this.spot();
    if (!s || !confirm(`¿Marcar "${s.name}" como OCUPADO?`)) return;
    this.service.occupyParkingSpot(s.id).subscribe({
      next: () =>
        this.spot.update((sp) => (sp ? { ...sp, active: true, status: 'OCCUPIED' } : sp)),
      error: (err) => alert('Error: ' + (err?.error?.message || err?.message)),
    });
  }

  releaseSpot() {
    const s = this.spot();
    if (!s) return;

    const activeRes = this.activeReservation();
    if (activeRes?.status === 'CHECKED_IN') {
      alert(
        `Este lugar tiene una reserva en curso (Patente: ${activeRes.vehiclePlate ?? activeRes.vehicleId}). Realizá el check-out desde Reservas.`
      );
      return;
    }

    if (!confirm(`¿Liberar el lugar "${s.name}"?`)) return;
    this.service.releaseParkingSpot(s.id).subscribe({
      next: () => {
        this.spot.update((sp) => (sp ? { ...sp, active: false, status: 'FREE' } : sp));
        this.activeReservation.set(undefined);
      },
      error: (err) => alert('Error: ' + (err?.error?.message || err?.message)),
    });
  }

  goBack() {
    this.router.navigate(['/parking-spot/parking-spot-list']);
  }

  goEdit() {
    const s = this.spot();
    if (s) this.router.navigate(['/parking-spot/parking-spot-form', s.id]);
  }
}