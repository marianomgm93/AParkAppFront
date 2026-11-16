import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly editingParkingLot = input<ParkingLotModel>();
  readonly editedParkingLot = output<ParkingLotModel>();

  private readonly routeParkingLot = signal<ParkingLotModel | undefined>(undefined);
  private readonly currentParkingLot = computed(
    () => this.editingParkingLot() ?? this.routeParkingLot()
  );

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

  private readonly parkingLotFormModel = signal<ParkingLotModelForForm>({
    ...this.emptyParkingLot,
    user: { ...this.emptyParkingLot.user },
    address: { ...this.emptyParkingLot.address },
  });

  protected readonly isEditing = computed(() => this.currentParkingLot() !== undefined);

  async ngOnInit() {
    const inputLot = this.editingParkingLot();
    if (inputLot) {
      this.setFormValues(inputLot);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const lot = await firstValueFrom(this.client.getParkingLotById(idParam));
      this.routeParkingLot.set(lot);
      this.setFormValues(lot);
    }
  }

  private setFormValues(lot: ParkingLotModel) {
    this.parkingLotFormModel.set({
      name: lot.name,
      active: lot.active,
      capacity: lot.capacity,
      user: {
        name: lot.user?.name ?? '',
        email: lot.user?.email ?? '',
      },
      address: {
        street: lot.address?.street ?? '',
        number: lot.address?.number ?? Number.NaN,
        zipcode: lot.address?.zipcode ?? '',
        notes: lot.address?.notes ?? '',
      },
    });
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
          const id = this.currentParkingLot()?.id;

          if (this.isEditing() && id !== undefined) {
            const edited = await firstValueFrom(
              this.client.updateParkingLot(parkingLot, id),
            );
            alert('Estacionamiento modificado');
            this.editedParkingLot.emit(edited);

            if (this.routeParkingLot()) {
              this.router.navigate(['/parkingLots']);
            }
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

  protected resetForm() {
    this.parkingLotFormModel.set({
      ...this.emptyParkingLot,
      user: { ...this.emptyParkingLot.user },
      address: { ...this.emptyParkingLot.address },
    });
  }
}