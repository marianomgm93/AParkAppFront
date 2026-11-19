import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { form, required, min, FormRoot, FormField } from '@angular/forms/signals';

import { ParkingSpotService } from '../../data-access/spot-client';
import { ParkingSpotModel, ParkingSpotRequest } from '../../data-access/spot-model';
import { ParkingLotService } from '../../../parking-lot/data-access/parking-lot.service';
import { ParkingLotModel } from '../../../parking-lot/data-access/parking-lot.model';

@Component({
  selector: 'app-parking-spot-form',
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './spot-form.html',
  styleUrl: './spot-form.css',
})
export default class ParkingSpotForm implements OnInit {
  private readonly spotService = inject(ParkingSpotService);
  private readonly parkingLotService = inject(ParkingLotService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly parkingLots = signal<ParkingLotModel[]>([]);
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

          try {
            if (this.isEditing() && spotId) {
              await firstValueFrom(this.spotService.updateParkingSpot(spotId, payload));
              alert('Lugar actualizado correctamente.');
              await this.router.navigate(['/parking-spot/parking-spot-list']);
            } else {
              await firstValueFrom(this.spotService.createParkingSpot(payload));
              alert('¡Lugar creado correctamente!');
              this.resetForm();
            }
          } catch (error: any) {
            const msg =
              error?.error?.message ||
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
      await this.loadParkingLots();

      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        await this.loadSpotForEdit(idParam);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async loadParkingLots(): Promise<void> {
    try {
      const lots = await firstValueFrom(this.parkingLotService.getAllParkingLots());
      this.parkingLots.set(lots);
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