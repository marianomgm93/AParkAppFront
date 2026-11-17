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

  private readonly emptySpot: SpotFormModel = {
    spotNumber: NaN,
    status: 'FREE'
  };

  private readonly spotFormModel = signal<SpotFormModel>({ ...this.emptySpot });

  readonly editingSpot = input<Spot>();
  readonly editedSpot = output<Spot>();
  readonly cancelEdit = output<void>();
  protected readonly isEditing = computed(() => this.editingSpot() !== undefined);

  async ngOnInit() {
    const editing = this.editingSpot();
    if (this.isEditing() && editing) {
      this.spotFormModel.set({
        spotNumber: editing.spotNumber,
        status: editing.status
      });
    }
  }

  protected readonly spotForm = form(
    this.spotFormModel,
    (spot) => {
      required(spot.spotNumber, { message: 'El número de espacio es requerido' });
      min(spot.spotNumber, 1, { message: 'El número debe ser mayor a 0' });
      required(spot.status, { message: 'El estado es requerido' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!confirm('¿Desea confirmar los datos del espacio?')) return;
          const data = fieldTree().value();
          const id = this.editingSpot()?.id;

          if (this.isEditing() && id) {
            const updated = await firstValueFrom(this.client.updateSpot(id, data));
            this.editedSpot.emit(updated);
            alert('Espacio actualizado con éxito!');
          } else {
            await firstValueFrom(this.client.addSpot(data));
            alert('Espacio agregado con éxito!');
            this.router.navigate(['/spots']);
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
      this.router.navigate(['/spots']);
    }
  }

  resetForm() {
    this.spotFormModel.set({ ...this.emptySpot });
  }
}