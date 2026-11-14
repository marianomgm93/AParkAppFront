import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ParkingLotService } from '../../data-access/parking-lot.service';
import { ParkingLotModel, ParkingLotModelForForm } from '../../data-access/parking-lot.model';
import { form, required, min, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-parking-lot-form',
  styleUrl: './parking-lot-form.css',
  templateUrl: './parking-lot-form.html',
})
export class ParkingLotForm implements OnInit {
  private readonly client = inject(ParkingLotService);
  readonly editingParkingLot = input<ParkingLotModel>();
  readonly editedParkingLot = output<ParkingLotModel>();

  private readonly emptyParkingLot: ParkingLotModelForForm = {
    name: '',
    active: false,
    capacity: Number.NaN,

    user: {
      email: '',
      name: '',
    },
    address: {
      street: '',
      number: Number.NaN,
      zipcode: '',
      notes: '',
    },
  };

  private readonly parkingLotFormModel = signal({ ...this.emptyParkingLot });
  protected readonly isEditing = computed(() => this.editingParkingLot() !== undefined);

  ngOnInit() {
    const editingParkingLot = this.editingParkingLot();
    if (this.isEditing() && editingParkingLot) {
      this.parkingLotFormModel.set(editingParkingLot);
    }
  }

  protected readonly ParkingLotForm = form(
    this.parkingLotFormModel,
    (parkingLot) => {
      required(parkingLot.name, { message: 'Nombre Requerido' });
      required(parkingLot.capacity, { message: 'Capacidad Requerida' });
      min(parkingLot.capacity, 1, { message: 'Capacidad minima 1' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!confirm('¿Desea confirmar los datos?')) return;

          const parkingLot = fieldTree().value();
          const id = this.editingParkingLot()?.id;

          if (this.isEditing() && id) {
            const editedParkingLot = await firstValueFrom(
              this.client.updateParkingLot(parkingLot, id),
            );
            alert('Estacionamiento modificado');
            this.editedParkingLot.emit(editedParkingLot);
          } else {
            await firstValueFrom(this.client.addParkingLot(parkingLot));
            alert('¡Estacionamiento agregado!');
            this.resetForm();
          }
        },
        onInvalid: () => {
          alert('¡Revise el formulario!');
        },
      },
    },
  );

  private resetForm() {
    this.parkingLotFormModel.set({
      ...this.emptyParkingLot,
      user: { ...this.emptyParkingLot.user },
      address: { ...this.emptyParkingLot.address },
    });
  }
}
