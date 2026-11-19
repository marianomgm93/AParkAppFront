import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../data-access/vehicle-service';
import { VehicleModel, NewVehicleRequest, VEHICLE_TYPES, VehicleTypeEnum } from '../../data-access/vehicle-model';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UserClient } from '../../../user/data-access/user-client';
import { User } from '../../../user/data-access/user';
import { AuthService } from '../../../auth/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormRoot, FormField, CommonModule],
  selector: 'app-vehicle-form',
  styleUrl: './vehicle-form.css',
  templateUrl: './vehicle-form.html',
})
export default class VehicleForm implements OnInit {
  private readonly service = inject(VehicleService);
  private readonly userClient = inject(UserClient);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  readonly users = signal<User[]>([]);
  readonly vehicleTypes = VEHICLE_TYPES;

  readonly editingVehicle = signal<VehicleModel | undefined>(undefined);
  protected readonly isEditing = computed(() => this.editingVehicle() !== undefined);

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');
  readonly isClient = computed(() => this.userRole() === 'ROLE_CLIENT');

  private readonly emptyRequest: NewVehicleRequest = {
    plate: '',
    userId: '',
    model: '',
    color: '',
    note: '',
    brand: '',
    vehicleType: 'Car',
  };

  private readonly formModel = signal<NewVehicleRequest>({ ...this.emptyRequest });

  protected readonly VehicleForm = form(
    this.formModel,
    (vehicle) => {
      required(vehicle.plate,       { message: 'La patente es requerida' });
      required(vehicle.userId,      { message: 'El propietario es requerido' });
      required(vehicle.model,       { message: 'El modelo es requerido' });
      required(vehicle.color,       { message: 'El color es requerido' });
      required(vehicle.brand,       { message: 'La marca es requerida' });
      required(vehicle.vehicleType, { message: 'El tipo de vehículo es requerido' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!confirm(`¿${this.isEditing() ? 'Guardar cambios' : 'Crear vehículo'}?`)) return;
          try {
            const data = fieldTree().value();
            const id = this.editingVehicle()?.id;
            if (this.isEditing() && id) {
              await firstValueFrom(this.service.updateVehicle(id, data));
              alert('Vehículo actualizado correctamente.');
              this.router.navigate(['/vehicle/vehicle-list']);
            } else {
              await firstValueFrom(this.service.createVehicle(data));
              alert('¡Vehículo registrado correctamente!');
              this.formModel.set({ ...this.emptyRequest });
            }
          } catch (error: any) {
            const msg = error?.error?.message || error?.message || 'Error de conexión';
            alert(`No se pudo ${this.isEditing() ? 'actualizar' : 'crear'} el vehículo: ${msg}`);
          }
        },
        onInvalid: () => alert('¡Revise los datos del formulario!'),
      },
    },
  );

  async ngOnInit() {
    const role = this.userRole();

    if (role === 'ROLE_ADMIN' || role === 'ROLE_OWNER') {
      try {
        this.users.set(await firstValueFrom(this.userClient.getAll()));
      } catch (e) {
        console.error('Error al cargar usuarios:', e);
      }
    } else {
      // Cliente: se asigna automáticamente su propio userId
      try {
        const me = this.authService.currentUser() ?? await firstValueFrom(this.userClient.getMe());
        if (me?.id) {
          this.formModel.update((v) => ({ ...v, userId: String(me.id) }));
        }
      } catch (e) {
        console.error('Error al cargar perfil:', e);
      }
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      try {
        const v = await firstValueFrom(this.service.getVehicleById(idParam));
        this.editingVehicle.set(v);
        this.formModel.set({
          plate:       v.plate,
          userId:      v.userId,
          model:       v.model,
          color:       v.color,
          note:        v.note ?? '',
          brand:       v.brand,
          vehicleType: v.vehicleType,
        });
      } catch (e) {
        console.error('Error al cargar vehículo:', e);
        alert('No se encontró el vehículo.');
        this.router.navigate(['/vehicle/vehicle-list']);
      }
    }
  }
}
