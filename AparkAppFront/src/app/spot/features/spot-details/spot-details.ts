import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkingSpotService } from '../../data-access/spot-client';
import { ParkingSpotModel } from '../../data-access/spot-model';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/auth-service';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-spot-detail',
  styleUrl: './spot-details.css',
  templateUrl: './spot-details.html',
})
export default class ParkingSpotDetail implements OnInit {
  private readonly service = inject(ParkingSpotService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly spot = signal<ParkingSpotModel | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal<string | undefined>(undefined);

  readonly userRole = this.authService.userRole;
  readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'ROLE_OWNER');

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID no encontrado.');
      this.loading.set(false);
      return;
    }
    try {
      const data = await firstValueFrom(this.service.getParkingSpotById(id));
      this.spot.set(data);
    } catch (e: any) {
      this.error.set('No se pudo cargar el lugar de estacionamiento.');
    } finally {
      this.loading.set(false);
    }
  }

  occupySpot() {
    const s = this.spot();
    if (!s || !confirm(`¿Marcar "${s.name}" como OCUPADO?`)) return;
    this.service.occupyParkingSpot(s.id).subscribe({
      next: () => this.spot.update((sp) => sp ? { ...sp, status: 'OCCUPIED' } : sp),
      error: (err) => alert('Error: ' + (err?.error?.message || err?.message)),
    });
  }

  releaseSpot() {
    const s = this.spot();
    if (!s || !confirm(`¿Liberar el lugar "${s.name}"?`)) return;
    this.service.releaseParkingSpot(s.id).subscribe({
      next: () => this.spot.update((sp) => sp ? { ...sp, status: 'FREE' } : sp),
      error: (err) => alert('Error: ' + (err?.error?.message || err?.message)),
    });
  }

  goBack() {
    this.router.navigate(['/parking-spot/parking-spot-list']);
  }

  goEdit() {
    const s = this.spot();
    if (s) this.router.navigate(['/parking-spot/parking-spot-form', s.id]);
  }
}
