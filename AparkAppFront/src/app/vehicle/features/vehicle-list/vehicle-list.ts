import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '../../data-access/vehicle-service';
import { VehicleModel } from '../../data-access/vehicle-model';
import { AuthService } from '../../../auth/auth-service';
import { ROUTE_COMMANDS } from '../../../app.route.segments';

@Component({
  imports: [CommonModule],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
})
export default class VehicleList implements OnInit {
  private readonly service = inject(VehicleService);
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);
  protected readonly commands = ROUTE_COMMANDS;

  private readonly vehicles = signal<VehicleModel[]>([]);

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');
  readonly isClient = computed(() => this.userRole() === 'ROLE_CLIENT');

  readonly sortedVehicles = computed(() =>
    [...this.vehicles()].sort((a, b) => a.plate.localeCompare(b.plate))
  );

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
   const userId = this.authService.currentUser()?.id;
    if (!userId) return;
    this.service.getMyVehicles(String(userId)).subscribe({
      next: (list) => this.vehicles.set(list),
      error: (err) => console.error('Error al cargar vehículos:', err),
    });
  }

  viewDetail(id: string) {
    this.router.navigate(this.commands.vehicleDetail(id));
  }

  edit(id: string) {
    this.router.navigate(this.commands.vehicleEdit(id));
  }

  delete(vehicle: VehicleModel) {
    if (!confirm(`¿Eliminar el vehículo "${vehicle.plate}" (${vehicle.brand} ${vehicle.model})?`)) return;
    this.service.deleteVehicle(vehicle.id).subscribe({
      next: () =>
        this.vehicles.update((list) => list.filter((v) => v.id !== vehicle.id)),
      error: (err) =>
        alert('Error al eliminar: ' + (err?.error?.message || err?.message)),
    });
  }
}
