import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingLotService } from '../../data-access/parking-lot.service';
import { ParkingLotModel } from '../../data-access/parking-lot.model';
import { AuthService } from '../../../auth/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-lot-list',
  styleUrl: './parking-lot-list.css',
  templateUrl: './parking-lot-list.html',
})

export default class ParkingLotList implements OnInit {
  private readonly service = inject(ParkingLotService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly parkingLots = signal<ParkingLotModel[]>([]);
  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');

  readonly sortedParkingLots = computed(() =>
    [...this.parkingLots()].sort((a, b) => a.name.localeCompare(b.name))
  );

  ngOnInit() {
    this.loadParkingLots();
  }

  loadParkingLots() {
    const role = this.userRole();
    if (role === 'ROLE_ADMIN') {
      this.service.getAllParkingLots().subscribe({
        next: (list) => this.parkingLots.set(list),
        error: (err) => console.error('Error al cargar todos los estacionamientos:', err)
      });
    } else if (role === 'ROLE_OWNER') {
      this.service.getMyParkingLots().subscribe({
        next: (list) => this.parkingLots.set(list),
        error: (err) => console.error('Error al cargar estacionamientos del propietario:', err)
      });
    } else {
      this.service.getActiveParkingLots().subscribe({
        next: (list) => this.parkingLots.set(list),
        error: (err) => console.error('Error al cargar estacionamientos activos:', err)
      });
    }
  }

  edit(id: string) {
    this.router.navigate(['/parking-lot/parking-lot-form', id]);
  }

  toggleActive(lot: ParkingLotModel) {
    if (lot.active) {
      if (!confirm(`¿Dar de baja lógica el estacionamiento "${lot.name}"?`)) return;
      this.service.deleteParkingLot(lot.id).subscribe({
        next: () => {
          this.parkingLots.update((list) =>
            list.map((p) => (p.id === lot.id ? { ...p, active: false } : p))
          );
        },
        error: (err) => alert('Error al dar de baja el estacionamiento: ' + (err?.error?.message || err?.message))
      });
    } else {
      if (!confirm(`¿Dar de alta lógica el estacionamiento "${lot.name}"?`)) return;
      this.service.restoreParkingLot(lot.id).subscribe({
        next: () => {
          this.parkingLots.update((list) =>
            list.map((p) => (p.id === lot.id ? { ...p, active: true } : p))
          );
        },
        error: (err) => alert('Error al dar de alta el estacionamiento: ' + (err?.error?.message || err?.message))
      });
    }
  }
}


