import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { form, required, min, FormRoot, FormField } from '@angular/forms/signals';

import { ParkingSpotService } from '../../data-access/spot-client';
import { ParkingSpotModel, ParkingSpotRequest } from '../../data-access/spot-model';
import { ParkingLotService } from '../../../parking-lot/data-access/parking-lot.service';
import { ParkingLotModel } from '../../../parking-lot/data-access/parking-lot.model';
import { AuthService } from '../../../auth/auth-service';

@Component({
  selector: 'app-parking-spot-form',
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './spot-form.html',
  styleUrl: './spot-form.css',
})
export default class ParkingSpotForm implements OnInit {
  private readonly spotService = inject(ParkingSpotService);
  private readonly parkingLotService = inject(ParkingLotService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  readonly userRole = this.authService.userRole;
  readonly parkingLots = signal<ParkingLotModel[]>([]);
  readonly existingSpots = signal<ParkingSpotModel[]>([]);
  readonly editingSpot = signal<ParkingSpotModel | undefined>(undefined);
  readonly loading = signal<boolean>(false);

  protected readonly isEditing = computed(() => this.editingSpot() !== undefined);

  private readonly emptyRequest: ParkingSpotRequest = {
    name: '',
    parkingLotId: '',
    active: true,
    number: 1,
  };

  private readonly formModel = signal<ParkingSpotRequest>({ ...this.emptyRequest });

  readonly suggestedNumber = computed(() => {
    const lotId = this.formModel().parkingLotId;
    if (!lotId || this.isEditing()) return null;
    return this.calculateNextNumber(lotId);
  });

  protected readonly spotForm = form(
    this.formModel,
    (spot) => {
      required(spot.name, { message: 'El nombre es requerido' });
      required(spot.parkingLotId, { message: 'El estacionamiento es requerido' });
      min(spot.number, 1, { message: 'El número debe ser mayor a 0' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          const actionLabel = this.isEditing() ? 'modificación' : 'creación';
          if (!confirm(`¿Confirmar ${actionLabel} del lugar de estacionamiento?`)) {
            return;
          }

          const payload = fieldTree().value();
          const spotId = this.editingSpot()?.id;

          // Validación local de duplicado por estacionamiento
          const duplicate = this.existingSpots().find(
            (s) =>
              String(s.parkingLotId) === String(payload.parkingLotId) &&
              Number(s.number) === Number(payload.number) &&
              s.id !== spotId
          );
          if (duplicate) {
            alert(
              `El número de lugar ${payload.number} ya está en uso en este estacionamiento ("${duplicate.name}"). Elija otro número.`
            );
            return;
          }

          try {
            if (this.isEditing() && spotId) {
              await firstValueFrom(this.spotService.updateParkingSpot(spotId, payload));
              alert('Lugar actualizado correctamente.');
              await this.router.navigate(['/parking-spot/parking-spot-list']);
            } else {
              await firstValueFrom(this.spotService.createParkingSpot(payload));
              alert('¡Lugar creado correctamente!');
              await this.router.navigate(['/parking-spot/parking-spot-list']);
            }
          } catch (error: any) {
            const msg =
              error?.error?.message ||
              error?.error?.error ||
              error?.message ||
              'Error de conexión con el servidor';
            alert(`No se pudo ${this.isEditing() ? 'modificar' : 'crear'} el lugar: ${msg}`);
          }
        },
        onInvalid: () => {
          alert('¡Revise los datos del formulario!');
        },
      },
    },
  );

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      await this.loadExistingSpots();
      await this.loadParkingLots();

      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        await this.loadSpotForEdit(idParam);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async loadExistingSpots(): Promise<void> {
    try {
      const role = this.userRole();
      const spots = role === 'ROLE_ADMIN'
        ? await firstValueFrom(this.spotService.getAllParkingSpots())
        : await firstValueFrom(this.spotService.getMyParkingSpots());
      this.existingSpots.set(spots);
    } catch (error) {
      console.error('Error al cargar lugares existentes:', error);
    }
  }

  private calculateNextNumber(lotId: string): number {
    const lotSpots = this.existingSpots().filter(
      (s) => String(s.parkingLotId) === String(lotId)
    );
    if (lotSpots.length === 0) return 1;
    const maxNum = Math.max(...lotSpots.map((s) => s.number));
    return maxNum + 1;
  }

  onParkingLotChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const lotId = target.value;
    if (!this.isEditing() && lotId) {
      const nextNum = this.calculateNextNumber(lotId);
      this.formModel.update((m) => ({
        ...m,
        parkingLotId: lotId,
        number: nextNum,
        name: m.name.startsWith('Lugar ') || !m.name ? `Lugar ${nextNum}` : m.name,
      }));
    }
  }

  private async loadParkingLots(): Promise<void> {
    try {
      const role = this.userRole();
      const lots = role === 'ROLE_ADMIN'
        ? await firstValueFrom(this.parkingLotService.getAllParkingLots())
        : await firstValueFrom(this.parkingLotService.getMyParkingLots());
      this.parkingLots.set(lots);

      if (lots.length === 1 && !this.isEditing()) {
        const lotId = String(lots[0].id);
        const nextNum = this.calculateNextNumber(lotId);
        this.formModel.update((m) => ({
          ...m,
          parkingLotId: lotId,
          number: nextNum,
          name: m.name.startsWith('Lugar ') || !m.name ? `Lugar ${nextNum}` : m.name,
        }));
      }
    } catch (error) {
      console.error('Error al cargar estacionamientos:', error);
    }
  }

  private async loadSpotForEdit(id: string): Promise<void> {
    try {
      const spot = await firstValueFrom(this.spotService.getParkingSpotById(id));
      this.editingSpot.set(spot);
      this.formModel.set({
        name: spot.name,
        parkingLotId: (spot as any).parkingLotId ?? '',
        active: spot.active,
        number: spot.number,
      });
    } catch (error) {
      console.error('Error al cargar lugar:', error);
      alert('No se encontró el lugar de estacionamiento.');
      await this.router.navigate(['/parking-spot/parking-spot-list']);
    }
  }

  private resetForm(): void {
    this.formModel.set({ ...this.emptyRequest });
    this.spotForm().reset();
  }
}
