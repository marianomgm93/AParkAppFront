import { Component, inject, OnInit, signal } from '@angular/core';
import { OfferService } from '../../data-acces/offer.service';
import { OfferModel, VehicleOption } from '../../data-acces/offer';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth-service';

@Component({
  imports: [DatePipe],
  selector: 'app-offer-list',
  styleUrl: './offer-list.css',
  templateUrl: './offer-list.html',
})
export default class OfferList implements OnInit {
  private readonly offerService = inject(OfferService);
  private readonly authService = inject(AuthService);
  readonly offers = signal<OfferModel[]>([]);
  readonly userVehicles = signal<VehicleOption[]>([]);
  ngOnInit(): void {
    this.loadOffers();
    this.loadVehicles();
  }
  loadOffers(): void {
    this.offerService.getActiveOffers().subscribe({
      next: (data) => this.offers.set(data),
      error: (err) => console.error('Error al cargar ofertas:', err),
    });
  }
  loadVehicles(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;
    this.offerService.getUserVehicles(String(userId)).subscribe({
      next: (vehicles) => this.userVehicles.set(vehicles),
      error: (err) => console.error('Error al cargar vehículos:', err),
    });
  }
  reserveOffer(offerId: string, vehicleId: string): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId || !vehicleId) {
      alert('Debes seleccionar un vehículo válido.');
      return;
    }
    this.offerService.acquireOffer(offerId, { userId: String(userId), vehicleId }).subscribe({
      next: () => {
        alert('¡Reserva creada exitosamente!');
        this.loadOffers(); // Refresca las ofertas activas
      },
      error: (err) => console.error('Error al reservar oferta:', err),
    });
  }
}
