import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../data-access/vehicle-service';
import { VehicleModel } from '../../data-access/vehicle-model';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/auth-service';

@Component({
  imports: [CommonModule],
  selector: 'app-vehicle-detail',
  styleUrl: './vehicle-details.css',
  templateUrl: './vehicle-details.html',
})
export default class VehicleDetail implements OnInit {
  private readonly service = inject(VehicleService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  readonly vehicle = signal<VehicleModel | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal<string | undefined>(undefined);

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID no encontrado.');
      this.loading.set(false);
      return;
    }
    try {
      const data = await firstValueFrom(this.service.getVehicleById(id));
      this.vehicle.set(data);
    } catch (e: any) {
      this.error.set('No se pudo cargar el vehículo.');
    } finally {
      this.loading.set(false);
    }
  }

  delete() {
    const v = this.vehicle();
    if (!v) return;
    if (!confirm(`¿Eliminar el vehículo "${v.plate}"? Esta acción no se puede deshacer.`)) return;
    this.service.deleteVehicle(v.id).subscribe({
      next: () => {
        alert('Vehículo eliminado.');
        this.router.navigate(['/vehicle/vehicle-list']);
      },
      error: (err) => alert('Error al eliminar: ' + (err?.error?.message || err?.message)),
    });
  }

  goEdit() {
    const v = this.vehicle();
    if (v) this.router.navigate(['/vehicle/vehicle-form', v.id]);
  }
}
