import { Component, inject, signal, OnInit } from '@angular/core';
import { SpotService } from '../../data-access/spot-client';
import { Router, ActivatedRoute } from '@angular/router';
import { Spot } from '../../data-access/spot-model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { SpotForm } from '../spot-form/spot-form';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, SpotForm],
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
      } catch (error) {
        alert('No se pudo cargar el espacio');
        this.router.navigate(['/spots']);
      }
    } else {
      alert('No se encontró el identificador del espacio');
      this.router.navigate(['/spots']);
    }
  }

  async onDelete() {
    if (!confirm('¿Desea borrar este espacio?') || !this.id) return;
    try {
      await firstValueFrom(this.client.deleteSpot(Number(this.id)));
      alert('Espacio eliminado con éxito');
      this.router.navigate(['/spots']);
    } catch (error) {
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