import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkingLotService } from '../../data-access/parking-lot.service';
import { ParkingLotModel, ParkingLotRequest } from '../../data-access/parking-lot.model';
import { form, required, min, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AddressService } from '../../../address/data-access/address.service';
import { AddressModel, AddressModelForForm } from '../../../address/data-access/address.model';
import { UserClient } from '../../../user/data-access/user-client';
import { User } from '../../../user/data-access/user';
import { AuthService } from '../../../auth/auth-service';
import { CommonModule } from '@angular/common';

type WizardStep = 'address' | 'parking-lot';

@Component({
  imports: [FormRoot, FormField, CommonModule],
  selector: 'app-parking-lot-form',
  styleUrl: './parking-lot-form.css',
  templateUrl: './parking-lot-form.html',
})
export default class ParkingLotForm implements OnInit {
  private readonly client = inject(ParkingLotService);
  private readonly addressService = inject(AddressService);
  private readonly userClient = inject(UserClient);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly editingParkingLot = input<ParkingLotModel>();
  readonly editedParkingLot = output<ParkingLotModel>();

  private readonly routeParkingLot = signal<ParkingLotModel | undefined>(undefined);
  private readonly currentParkingLot = computed(
    () => this.editingParkingLot() ?? this.routeParkingLot()
  );

  readonly users = signal<User[]>([]);

  readonly ownerUsers = computed(() =>
    this.users().filter((user) => {
      const roles = user.roles;
      if (Array.isArray(roles)) {
        return roles.some((r) => r === 'ROLE_OWNER' || r === 'OWNER');
      }
      if (typeof roles === 'string') {
        return roles.includes('ROLE_OWNER') || roles.includes('OWNER');
      }
      return false;
    })
  );

  // Dirección creada en el paso 1
  readonly createdAddress = signal<AddressModel | undefined>(undefined);

  // Paso actual del wizard (en edición se salta directo al paso 2)
  readonly step = signal<WizardStep>('address');

  protected readonly isEditing = computed(() => this.currentParkingLot() !== undefined);

  // ── Paso 1: formulario de dirección ─────────────────────────────────────────

  private readonly emptyAddress: AddressModelForForm = {
    street: '',
    number: Number.NaN,
    zipCode: '',
    notes: '',
  };

  private readonly addressFormModel = signal<AddressModelForForm>({ ...this.emptyAddress });

  protected readonly AddressForm = form(
    this.addressFormModel,
    (address) => {
      required(address.street,  { message: 'Calle requerida' });
      required(address.number,  { message: 'Número requerido' });
      required(address.zipCode, { message: 'Código postal requerido' });
      min(address.number, 0,    { message: 'Número debe ser >= 0' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!this.authService.isAuthenticated() || !this.authService.accessToken()) {
            alert('Su sesión ha expirado o no ha iniciado sesión. Por favor inicie sesión.');
            this.router.navigate(['/auth/login']);
            return;
          }

          if (!confirm('¿Confirmar los datos del domicilio?')) return;
          try {
            const address = fieldTree().value();
            const created = await firstValueFrom(this.addressService.addAddress(address));
            this.createdAddress.set(created);
            // Pre-cargar el addressId en el form de parking lot
            this.parkingLotFormModel.update(v => ({ ...v, addressId: created.id as string }));
            this.step.set('parking-lot');
          } catch (error: any) {
            console.error('Error al guardar dirección:', error);
            const msg = error?.error?.message || error?.error?.error || error?.message || 'Error de conexión con el servidor';
            alert(`No se pudo crear la dirección: ${msg}`);
          }
        },
        onInvalid: () => alert('¡Revise los datos de la dirección! Complete todos los campos obligatorios.'),
      },
    },
  );

  protected resetAddressForm() {
    this.addressFormModel.set({ ...this.emptyAddress });
  }

  // ── Paso 2: formulario de parking lot ───────────────────────────────────────

  private readonly emptyRequest: ParkingLotRequest = {
    name: '',
    addressId: '',
    capacity: Number.NaN,
    ownerId: '',
  };

  private readonly parkingLotFormModel = signal<ParkingLotRequest>({ ...this.emptyRequest });

  protected readonly ParkingLotForm = form(
    this.parkingLotFormModel,
    (parkingLot) => {
      required(parkingLot.name,      { message: 'Nombre requerido' });
      required(parkingLot.capacity,  { message: 'Capacidad requerida' });
      min(parkingLot.capacity, 1,    { message: 'Capacidad mínima: 1' });
      required(parkingLot.addressId, { message: 'Dirección requerida' });
      required(parkingLot.ownerId,   { message: 'Responsable requerido' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          if (!confirm('¿Desea confirmar los datos del estacionamiento?')) return;
          try {
            const parkingLot = fieldTree().value();
            const id = this.currentParkingLot()?.id;

            if (this.isEditing() && id !== undefined) {
              const edited = await firstValueFrom(
                this.client.updateParkingLot(parkingLot, id),
              );
              alert('Estacionamiento modificado');
              this.editedParkingLot.emit(edited);
              if (this.routeParkingLot()) {
                this.router.navigate(['/parking-lot/parking-lot-list']);
              }
            } else {
              await firstValueFrom(this.client.addParkingLot(parkingLot));
              alert('¡Estacionamiento agregado!');
              this.fullReset();
            }
          } catch (error: any) {
            console.error('Error al guardar estacionamiento:', error);
            const msg = error?.error?.message || error?.error?.error || error?.message || 'Error de conexión con el servidor';
            alert(`No se pudo ${this.isEditing() ? 'modificar' : 'crear'} el estacionamiento: ${msg}`);
          }
        },
        onInvalid: () => alert('¡Revise el formulario!'),
      },
    },
  );

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');

  // ── Ciclo de vida ────────────────────────────────────────────────────────────

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      alert('Debe iniciar sesión para crear o editar un estacionamiento.');
      this.router.navigate(['/auth/login']);
      return;
    }

    const role = this.authService.userRole();
    if (role !== 'ROLE_ADMIN' && role !== 'ROLE_OWNER') {
      alert('Solo los administradores y propietarios tienen permiso para crear o editar estacionamientos.');
      this.router.navigate(['/parking-lot/parking-lot-list']);
      return;
    }

    if (role === 'ROLE_ADMIN') {
      try {
        this.users.set(await firstValueFrom(this.userClient.getAll()));
      } catch (e) {
        console.error('Error cargando usuarios:', e);
      }
    } else if (role === 'ROLE_OWNER') {
      try {
        const me = this.authService.currentUser() ?? await firstValueFrom(this.userClient.getMe());
        if (me && me.id) {
          this.parkingLotFormModel.update(v => ({ ...v, ownerId: String(me.id) }));
        }
      } catch (e) {
        console.error('Error cargando perfil del propietario:', e);
      }
    }

    const inputLot = this.editingParkingLot();
    if (inputLot) {
      this.setFormValues(inputLot);
      this.step.set('parking-lot');
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      try {
        const lot = await firstValueFrom(this.client.getParkingLotById(idParam));
        this.routeParkingLot.set(lot);
        this.setFormValues(lot);
        this.step.set('parking-lot');
      } catch (e) {
        console.error('Error cargando estacionamiento:', e);
      }
    }
  }

  private setFormValues(lot: ParkingLotModel) {
    this.parkingLotFormModel.set({
      name: lot.name,
      capacity: lot.capacity,
      addressId: lot.addressId,
      ownerId: lot.ownerId,
    });
  }

  /** Volver al paso 1 y limpiar todo */
  protected goBackToAddress() {
    this.createdAddress.set(undefined);
    this.parkingLotFormModel.update(v => ({ ...v, addressId: '' }));
    this.resetAddressForm();
    this.step.set('address');
  }

  protected fullReset() {
    this.createdAddress.set(undefined);
    this.addressFormModel.set({ ...this.emptyAddress });
    this.parkingLotFormModel.set({ ...this.emptyRequest });
    this.step.set('address');
  }
}
