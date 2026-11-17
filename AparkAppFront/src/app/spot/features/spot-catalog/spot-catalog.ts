import { Component, inject, signal, computed } from '@angular/core';
import { SpotService } from '../../data-access/spot-client';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-spot-catalogo',
  styleUrl: './spot-catalog.css',
  templateUrl: './spot-catalog.html',
})
export class SpotCatalog {
  private readonly spotService = inject(SpotService);
  protected readonly router = inject(Router);
  
  // Consumo reactivo del servicio mediante toSignal
  private readonly spots = toSignal(this.spotService.getAllspots(), { initialValue: [] });

  protected readonly sortOrder = signal<'spotNumber' | 'status'>('spotNumber');

  protected readonly filteredSpots = computed(() => {
    const items = [...(this.spots() || [])];
    const criterio = this.sortOrder();

    return items.sort((a, b) => {
      if (criterio === 'status') {
        return a.status.localeCompare(b.status);
      }
      return a.spotNumber - b.spotNumber;
    });
  });

  protected ordenarPor(criterio: 'spotNumber' | 'status') {
    this.sortOrder.set(criterio);
  }

  protected verDetalle(id?: number) {
    if (id) {
      this.router.navigate(['/spot-detalle', id]);
    }
  }
}