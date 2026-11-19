import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingSpotService } from '../../data-access/spot-client'
import { ParkingSpotModel } from '../../data-access/spot-model';
import { AuthService } from '../../../auth/auth-service';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-spot-list',
  styleUrl: './spot-catalog.css',
  templateUrl: './spot-catalog.html',
})
export  default class SpotCatalog implements OnInit {

  private readonly service = inject(ParkingSpotService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly spots = signal<ParkingSpotModel[]>([]);

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');

  readonly sortedSpots = computed(() =>
    [...this.spots()].sort((a, b) => a.number - b.number)
  );

  ngOnInit() {
    this.loadSpots();
  }

  loadSpots() {
    this.service.getAllParkingSpots().subscribe({
      next: (list) => this.spots.set(list),
      error: (err) => console.error('Error al cargar lugares:', err),
    });
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
            list.map((s) => (s.id === spot.id ? { ...s, active: false } : s))
          ),
        error: (err) =>
          alert('Error al dar de baja: ' + (err?.error?.message || err?.message)),
      });
    } else {
      if (!confirm(`¿Dar de alta el lugar "${spot.name}" (N° ${spot.number})?`)) return;
      this.service.restoreParkingSpot(spot.id).subscribe({
        next: () =>
          this.spots.update((list) =>
            list.map((s) => (s.id === spot.id ? { ...s, active: true } : s))
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
          list.map((s) => (s.id === spot.id ? { ...s, status: 'OCCUPIED' } : s))
        ),
      error: (err) =>
        alert('Error al ocupar lugar: ' + (err?.error?.message || err?.message)),
    });
  }

  releaseSpot(spot: ParkingSpotModel) {
    if (!confirm(`¿Liberar el lugar "${spot.name}"?`)) return;
    this.service.releaseParkingSpot(spot.id).subscribe({
      next: () =>
        this.spots.update((list) =>
          list.map((s) => (s.id === spot.id ? { ...s, status: 'FREE' } : s))
        ),
      error: (err) =>
        alert('Error al liberar lugar: ' + (err?.error?.message || err?.message)),
    });
  }
}
