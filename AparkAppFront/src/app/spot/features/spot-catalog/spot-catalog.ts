import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ParkingSpotService } from '../../data-access/spot-client';
import { ParkingSpotModel } from '../../data-access/spot-model';
import { ParkingLotService } from '../../../parking-lot/data-access/parking-lot.service';
import { ParkingLotModel } from '../../../parking-lot/data-access/parking-lot.model';
import { AuthService } from '../../../auth/auth-service';
import { ROUTE_COMMANDS } from '../../../app.route.segments';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-spot-list',
  styleUrl: './spot-catalog.css',
  templateUrl: './spot-catalog.html',
})
export default class SpotCatalog implements OnInit {
  private readonly service = inject(ParkingSpotService);
  private readonly parkingLotService = inject(ParkingLotService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly commands = ROUTE_COMMANDS;
  private readonly spots = signal<ParkingSpotModel[]>([]);
  readonly parkingLots = signal<ParkingLotModel[]>([]);
  readonly selectedLotId = signal<string>('');

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');

  readonly filteredSpots = computed(() => {
    const lotId = this.selectedLotId();
    if (!lotId) return this.spots();
    return this.spots().filter((s) => String(s.parkingLotId) === lotId);
  });

  readonly sortedSpots = computed(() =>
    [...this.filteredSpots()].sort((a, b) => {
      const lotCompare = (a.parkingLotName || '').localeCompare(b.parkingLotName || '');
      if (lotCompare !== 0) return lotCompare;
      return a.number - b.number;
    }),
  );

  async ngOnInit() {
    await this.loadParkingLots();
    this.loadSpots();
  }

  async loadParkingLots() {
    try {
      const role = this.userRole();
      const lots =
        role === 'ROLE_ADMIN'
          ? await firstValueFrom(this.parkingLotService.getAllParkingLots())
          : await firstValueFrom(this.parkingLotService.getMyParkingLots());
      this.parkingLots.set(lots);
    } catch (err) {
      console.error('Error al cargar estacionamientos:', err);
    }
  }

  loadSpots() {
    const role = this.userRole();
    const fetch$ =
      role === 'ROLE_ADMIN' ? this.service.getAllParkingSpots() : this.service.getMyParkingSpots();

    fetch$.subscribe({
      next: (list) => this.spots.set(list),
      error: (err) => console.error('Error al cargar lugares:', err),
    });
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedLotId.set(target.value);
  }

  create() {
    this.router.navigate(this.commands.parkingSpotCreate);
  }
  viewDetail(id: string) {
    this.router.navigate(this.commands.parkingSpotDetail(id));
  }
  edit(id: string) {
    this.router.navigate(this.commands.parkingSpotEdit(id));
  }

  toggleActive(spot: ParkingSpotModel) {
    if (spot.active) {
      if (!confirm(`¿Dar de baja el lugar "${spot.name}" (N° ${spot.number})?`)) return;
      this.service.deleteParkingSpot(spot.id).subscribe({
        next: () =>
          this.spots.update((list) =>
            list.map((s) => (s.id === spot.id ? { ...s, active: false } : s)),
          ),
        error: (err) => alert('Error al dar de baja: ' + (err?.error?.message || err?.message)),
      });
    } else {
      if (!confirm(`¿Dar de alta el lugar "${spot.name}" (N° ${spot.number})?`)) return;
      this.service.restoreParkingSpot(spot.id).subscribe({
        next: () =>
          this.spots.update((list) =>
            list.map((s) => (s.id === spot.id ? { ...s, active: true } : s)),
          ),
        error: (err) => alert('Error al dar de alta: ' + (err?.error?.message || err?.message)),
      });
    }
  }

  occupySpot(spot: ParkingSpotModel) {
    if (!confirm(`¿Marcar el lugar "${spot.name}" como OCUPADO?`)) return;
    this.service.occupyParkingSpot(spot.id).subscribe({
      next: () =>
        this.spots.update((list) =>
          list.map((s) => (s.id === spot.id ? { ...s, status: 'OCCUPIED' } : s)),
        ),
      error: (err) => alert('Error al ocupar lugar: ' + (err?.error?.message || err?.message)),
    });
  }

  releaseSpot(spot: ParkingSpotModel) {
    if (!confirm(`¿Liberar el lugar "${spot.name}"?`)) return;
    this.service.releaseParkingSpot(spot.id).subscribe({
      next: () =>
        this.spots.update((list) =>
          list.map((s) => (s.id === spot.id ? { ...s, status: 'FREE' } : s)),
        ),
      error: (err) => alert('Error al liberar lugar: ' + (err?.error?.message || err?.message)),
    });
  }
}
