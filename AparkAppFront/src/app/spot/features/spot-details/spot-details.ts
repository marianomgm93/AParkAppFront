import { Component, inject, signal, OnInit } from '@angular/core';
import { SpotService } from '../../data-access/spot-client';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Spot } from '../../data-access/spot-model';
import { firstValueFrom } from 'rxjs';
import { SpotForm } from '../spot-form/spot-form';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, SpotForm, RouterLink],
  selector: 'app-spot-details',
  styleUrl: './spot-details.css',
  templateUrl: './spot-details.html',
})
export class SpotDetails implements OnInit {
  
  private readonly route = inject(ActivatedRoute);
  private readonly client = inject(SpotService);
  private readonly router = inject(Router);

  private readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly spot = signal<Spot | null>(null);
  protected readonly isEditing = signal(false);

  async ngOnInit() {
    if (this.id) {
      try {
        const foundSpot = await firstValueFrom(this.client.getSpotById(this.id));
        this.spot.set(foundSpot);
      } catch {
        alert('No se pudo cargar el espacio');
        this.router.navigate(['/parking-lot']);
      }
    } else {
      alert('No se encontró el identificador del espacio');
      this.router.navigate(['/parking-lot']);
    }
  }

  async onOccupy() {
    const current = this.spot();
    if (!current) return;
    try {
      await firstValueFrom(this.client.occupySpot(current.id));
      const refreshed = await firstValueFrom(this.client.getSpotById(current.id));
      this.spot.set(refreshed);
    } catch {
      alert('No se pudo marcar el espacio como ocupado');
    }
  }

  async onRelease() {
    const current = this.spot();
    if (!current) return;
    try {
      await firstValueFrom(this.client.releaseSpot(current.id));
      const refreshed = await firstValueFrom(this.client.getSpotById(current.id));
      this.spot.set(refreshed);
    } catch {
      alert('No se pudo liberar el espacio');
    }
  }

  async onDelete() {
    if (!confirm('¿Desea borrar este espacio?') || !this.id) return;
    try {
      await firstValueFrom(this.client.deleteSpot(this.id));
      alert('Espacio eliminado con éxito');
      this.router.navigate(['/parking-lot']);
    } catch {
      alert('Error al eliminar el espacio');
    }
  }

  onEdit(updatedSpot: Spot) {
    this.spot.set(updatedSpot);
    this.isEditing.set(false);
  }

  toggleEdit() {
    this.isEditing.update(value => !value);
  }
}