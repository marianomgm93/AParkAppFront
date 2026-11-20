import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '../../data-access/vehicle-service';
import { VehicleModel } from '../../data-access/vehicle-model';
import { AuthService } from '../../../auth/auth-service';
import { User } from '../../../user/data-access/user';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
})
export default class VehicleList {
  private readonly service = inject(VehicleService);
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  private readonly vehicles = signal<VehicleModel[]>([]);
  private readonly users = signal<User[]>([]);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly userRole = this.authService.userRole;
  readonly currentUser = this.authService.currentUser;
  readonly currentUserId = computed(() => this.currentUser()?.id ?? null);

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

  readonly canManageAll = computed(() => this.isAdmin() || this.isOwner());

  private readonly usersById = computed(() => {
    const map = new Map<string, User>();
    for (const u of this.users()) {
      map.set(String(u.id), u);
    }
    return map;
  });

  readonly sortedVehicles = computed(() => {
    const uid = this.currentUserId();

    const filtered = this.isClient()
      ? uid
        ? this.vehicles().filter((v) => String(v.userId) === String(uid))
        : []
      : this.vehicles();

    return [...filtered].sort((a, b) =>
      (a.plate ?? '').localeCompare(b.plate ?? '')
    );
  });

  constructor() {
    effect(() => {
      const uid = this.currentUserId();
      const client = this.isClient();
      const admin = this.isAdmin();

      if (client && !uid) return;

      this.loadVehicles(client ? String(uid) : undefined);

      if (admin) {
        this.loadUsersForAdmin();
      } else {
        this.users.set([]);
      }
    });
  }

  loadVehicles(clientUserId?: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request$ = clientUserId
      ? this.service.getVehiclesByUser(clientUserId)
      : this.service.getAllVehicles();

    request$.subscribe({
      next: (list) => {
        this.vehicles.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.errorMessage.set(
          err?.error?.message || 'No se pudieron cargar los vehículos.'
        );
        this.loading.set(false);
      },
    });
  }

  private loadUsersForAdmin(): void {
    this.service.getUsersForAdmin(true).subscribe({
      next: (list) => this.users.set(list),
      error: (err) => console.warn('No se pudieron cargar usuarios para el listado:', err),
    });
  }

  getOwnerLabel(userId: string): string {
    const found = this.usersById().get(String(userId));
    if (found) {
      return `${found.name} (${found.email})`;
    }
    const me = this.currentUser();
    if (me && String(me.id) === String(userId)) {
      return `${me.name} (${me.email})`;
    }
    return userId;
  }

  viewDetail(id: string): void {
    this.router.navigate(['/vehicle/vehicle-detail', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/vehicle/vehicle-form', id]);
  }

  viewReservations(plate: string): void {
    this.router.navigate(['/reservation'], { queryParams: { plate } });
  }

  goToNewReservation(vehicle: VehicleModel): void {
    this.router.navigate(['/reservation/new'], {
      queryParams: {
        vehicleId: vehicle.id,
        userId: vehicle.userId,
        plate: vehicle.plate,
      },
    });
  }

  delete(vehicle: VehicleModel): void {
    if (
      !confirm(
        `¿Eliminar el vehículo "${vehicle.plate}" (${vehicle.brand} ${vehicle.model})?`
      )
    ) {
      return;
    }

    this.errorMessage.set(null);
    this.service.deleteVehicle(vehicle.id).subscribe({
      next: () => {
        this.vehicles.update((list) => list.filter((v) => v.id !== vehicle.id));
      },
      error: (err) => {
        const msg =
          err?.error?.message || err?.message || 'Error al eliminar el vehículo.';
        this.errorMessage.set(msg);
        alert('Error al eliminar: ' + msg);
      },
    });
  }
}