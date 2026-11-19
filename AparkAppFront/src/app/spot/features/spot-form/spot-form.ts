import { Component, inject, signal, input, output, computed, OnInit } from '@angular/core';
import { form, FormField, FormRoot, required, min } from '@angular/forms/signals';
import { SpotService } from '../../data-access/spot-client';
import { SpotFormModel, Spot } from '../../data-access/spot-model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-spot-form',
  styleUrl: './spot-form.css',
  templateUrl: './spot-form.html',
})
export class SpotForm implements OnInit {
  private readonly client = inject(SpotService);
  private readonly router = inject(Router);

  readonly parkingLotId = input.required<string>();

  readonly editingSpot = input<Spot>();
  readonly editedSpot = output<Spot>();
  readonly cancelEdit = output<void>();

  private buildEmptySpot(lotId: string): SpotFormModel {
    return {
      name: '',
      parkingLotId: lotId,
      active: true,
      number: 1
    };
  }

  private readonly spotFormModel = signal<SpotFormModel>(this.buildEmptySpot(''));

  protected readonly isEditing = computed(() => this.editingSpot() !== undefined);

  async ngOnInit() {
    const lotId = this.parkingLotId();
    const editing = this.editingSpot();

    if (this.isEditing() && editing) {
      this.spotFormModel.set({
        name: editing.name,
        parkingLotId: editing.parkingLotId || lotId,
        active: editing.active,
        number: editing.number
      });
    } else {
      this.spotFormModel.set(this.buildEmptySpot(lotId));
    }
  }

  protected readonly spotForm = form(
    this.spotFormModel,
    (spot) => {
      required(spot.name, { message: 'El nombre del espacio es requerido' });
      required(spot.number, { message: 'El número de espacio es requerido' });
      min(spot.number, 1, { message: 'El número debe ser mayor a 0' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!confirm('¿Desea confirmar los datos del espacio?')) return;

          const lotId = this.parkingLotId();

          const raw = fieldTree().value();
          
          const payload: SpotFormModel = {
            ...raw,
            parkingLotId: lotId
          };
          const id = this.editingSpot()?.id;

          if (this.isEditing() && id) {
            const updated = await firstValueFrom(this.client.updateSpot(id, payload));
            this.editedSpot.emit(updated);
            alert('Espacio actualizado con éxito!');
          } else {
            await firstValueFrom(this.client.addSpot(payload));
            alert('Espacio agregado con éxito!');
            this.router.navigate(['/parking-lot', lotId]);
          }
        },
        onInvalid: () => {
          alert('Por favor, revise el formulario.');
        }
      }
    }
  );

  onCancel() {
    if (this.isEditing()) {
      this.cancelEdit.emit();
    } else {
      this.router.navigate(['/parking-lot', this.parkingLotId()]);
    }
  }

  resetForm() {
    this.spotFormModel.set(this.buildEmptySpot(this.parkingLotId()));
  }
}