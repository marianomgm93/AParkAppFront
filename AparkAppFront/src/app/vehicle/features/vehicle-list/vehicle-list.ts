import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../data-access/vehicle-service';
import { VehicleDTO } from '../../data-access/vehicle-model';

@Component({
  selector: 'app-vehicle-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css'
})
export class VehicleListComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);

  vehicles = signal<VehicleDTO[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.errorMessage.set(
          err.status === 403 || err.status === 401
            ? 'No tienes permisos o necesitas iniciar sesión para ver los vehículos.'
            : 'Error al conectar con el servidor. Verifica que el backend esté corriendo.'
        );
        this.isLoading.set(false);
      }
    });
  }

  filteredVehicles(): VehicleDTO[] {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.vehicles();

    return this.vehicles().filter(v =>
      v.plate.toLowerCase().includes(term) ||
      v.brand.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.vehicleType.toLowerCase().includes(term)
    );
  }

  deleteVehicle(id: string, plate: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el vehículo con patente "${plate}"?`)) {
      this.vehicleService.delete(id).subscribe({
        next: () => {
          this.vehicles.update(list => list.filter(v => v.id !== id));
        },
        error: (err) => {
          console.error('Error al eliminar vehículo:', err);
          alert('No se pudo eliminar el vehículo. ' + (err.error?.message || 'Intente nuevamente.'));
        }
      });
    }
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      Car: 'Auto',
      MotorCycle: 'Moto',
      Truck: 'Camión',
      SUV: 'SUV',
      Custom: 'Especial'
    };
    return map[type] || type;
  }
}