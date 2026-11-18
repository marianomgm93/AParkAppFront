import { Component, OnInit, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../data-access/address.service';
import { AddressModel, AddressModelForForm } from '../../data-access/address.model';
import { form, required, min, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [CommonModule, FormRoot, FormField],
  selector: 'app-address-form',
  styleUrl: './address-form.css',
  templateUrl: './address-form.html',
})

export default class AddressForm implements OnInit {
  private readonly client = inject(AddressService);
  readonly editingAddress = input<AddressModel>();
  readonly editedAddress = output<AddressModel>();

  private readonly emptyAddress: AddressModelForForm = {
    street: '',
    number: Number.NaN,
    zipCode: '',
    notes: '',
  };

  private readonly addressFormModel = signal({ ...this.emptyAddress });
  protected readonly isEditing = computed(() => this.editingAddress() !== undefined);

  ngOnInit() {
    const addr = this.editingAddress();
    if (this.isEditing() && addr) {
      const { id, ...rest } = addr as any;
      this.addressFormModel.set(rest);
    }
  }

  protected readonly AddressForm = form(
    this.addressFormModel,
    (address) => {
      required(address.street, { message: 'Calle requerida' });
      required(address.zipCode, { message: 'Código postal requerido' });
      min(address.number, 0, { message: 'Número debe ser mayor o igual a 0' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!confirm('¿Confirmar los datos del domicilio?')) return;
          const address = fieldTree().value();
          const id = this.editingAddress()?.id;
          if (this.isEditing() && id != null) {
            const updated = await firstValueFrom(this.client.updateAddress(address, id));
            alert('Dirección actualizada');
            this.editedAddress.emit(updated);
          } else {
            const created = await firstValueFrom(this.client.addAddress(address));
            alert('Dirección creada');
            this.resetForm();
          }
        },
        onInvalid: () => alert('¡Revise el formulario!'),
      },
    },
  );

  private resetForm() {
    this.addressFormModel.set({ ...this.emptyAddress });
  }
}
