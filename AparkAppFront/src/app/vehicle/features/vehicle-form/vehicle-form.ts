import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../data-access/vehicle-service';
import { NewVehicleDTO, VehicleTypeEnum } from '../../data-access/vehicle-model';

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css'
})
export default class VehicleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  vehicleId: string | null = null;
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  vehicleTypes: { value: VehicleTypeEnum; label: string }[] = [
    { value: 'Car', label: 'Auto / Automóvil' },
    { value: 'MotorCycle', label: 'Motocicleta' },
    { value: 'SUV', label: 'SUV / Utilitario' },
    { value: 'Truck', label: 'Camión / Camioneta' },
    { value: 'Custom', label: 'Especial / Personalizado' }
  ];

  vehicleForm: FormGroup = this.fb.group({
    plate: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{4,10}$/)]],
    brand: ['', [Validators.required, Validators.minLength(2)]],
    model: ['', [Validators.required]],
    color: ['', [Validators.required]],
    vehicleType: ['Car', [Validators.required]],
    note: [''],
    userId: ['00000000-0000-0000-0000-000000000000', [Validators.required]]
  });

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId') || localStorage.getItem('user_id');
    if (storedUserId) {
      this.vehicleForm.patchValue({ userId: storedUserId });
    }

    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.isEditMode.set(true);
      this.loadVehicleData(this.vehicleId);
    }
  }

  loadVehicleData(id: string): void {
    this.isLoading.set(true);
    this.vehicleService.getById(id).subscribe({
      next: (vehicle) => {
        this.vehicleForm.patchValue({
          plate: vehicle.plate,
          brand: vehicle.brand,
          model: vehicle.model,
          color: vehicle.color,
          vehicleType: vehicle.vehicleType,
          note: vehicle.note || '',
          userId: vehicle.userId
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar vehículo:', err);
        this.errorMessage.set('No se pudo encontrar el vehículo especificado.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.vehicleForm.value;
    const vehicleData: NewVehicleDTO = {
      plate: formValue.plate.trim().toUpperCase(),
      brand: formValue.brand.trim(),
      model: formValue.model.trim(),
      color: formValue.color.trim(),
      vehicleType: formValue.vehicleType,
      note: formValue.note?.trim() || undefined,
      userId: formValue.userId.trim()
    };

    const request$ = this.isEditMode() && this.vehicleId
      ? this.vehicleService.update(this.vehicleId, vehicleData)
      : this.vehicleService.create(vehicleData);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/vehicles']);
      },
      error: (err) => {
        console.error('Error al guardar vehículo:', err);
        this.isSubmitting.set(false);

        if (err.status === 409 || err.error?.message?.includes('already exists')) {
          this.errorMessage.set('Ya existe un vehículo registrado con esta patente.');
        } else if (err.status === 404 && err.error?.message?.includes('User')) {
          this.errorMessage.set('El ID de usuario ingresado no existe en la base de datos.');
        } else {
          this.errorMessage.set(err.error?.message || 'Ocurrió un error al procesar la solicitud.');
        }
      }
    });
  }
}