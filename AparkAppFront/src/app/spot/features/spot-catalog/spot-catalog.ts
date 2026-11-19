import { Component, inject, signal, computed, input } from '@angular/core';
import { SpotService } from '../../data-access/spot-client';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
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

  readonly parkingLotId = input.required<string>();

  private readonly allSpots = toSignal(this.spotService.getAllSpots(), { initialValue: [] });

  private readonly lotSpots = computed(() => {
    const lotId = this.parkingLotId();
    return (this.allSpots() || []).filter(spot => spot.parkingLotId === lotId);
  });

  protected readonly sortOrder = signal<'number' | 'status'>('number');

  protected readonly filteredSpots = computed(() => {
    const items = [...this.lotSpots()];
    const criterio = this.sortOrder();

    return items.sort((a, b) => {
      if (criterio === 'status') {
        return a.status.localeCompare(b.status);
      }
      return a.number - b.number;
    });
  });

  protected readonly freeCount = computed(() =>
    this.lotSpots().filter(s => s.status === 'FREE').length
  );

  protected readonly occupiedCount = computed(() =>
    this.lotSpots().filter(s => s.status === 'OCCUPIED').length
  );

  protected ordenarPor(criterio: 'number' | 'status') {
    this.sortOrder.set(criterio);
  }

  protected verDetalle(id?: string) {
    if (id) {
      this.router.navigate(['/parkingspots', id]);
    }
  }
}