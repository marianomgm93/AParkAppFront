import { Component, inject, OnInit, signal } from '@angular/core';
import { OfferService } from '../../data-acces/offer.service';
import { ParkingLotService } from '../../../parking-lot/data-access/parking-lot.service';
import { Router } from '@angular/router';
import { ParkingLotModel } from '../../../parking-lot/data-access/parking-lot.model';
import { CreateOfferRequest, ParkingSpotModel } from '../../data-acces/offer';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-offer-form',
  styleUrl: './offer-form.css',
  templateUrl: './offer-form.html',
})
export default class OfferForm implements OnInit {
  private readonly offerService = inject(OfferService);
  private readonly parkingLotService = inject(ParkingLotService);
  private readonly router = inject(Router);
  readonly myParkingLots = signal<ParkingLotModel[]>([]);
  readonly availableSpots = signal<ParkingSpotModel[]>([]);

  private readonly initialModel: CreateOfferRequest = {
    parkingLotId: '',
    parkingSpotId: '',
    stayType: 'Hour',
    startTime: '',
    endTime: '',
  };
  private readonly formModel = signal<CreateOfferRequest>({
    ...this.initialModel,
  });

  protected readonly offerForm = form(
    this.formModel,
    (f) => {
      required(f.parkingLotId, { message: 'Estacionamiento requerido' });
      required(f.stayType, { message: 'Tipo requerido' });
      required(f.startTime, { message: 'Inicio requerido' });
      required(f.endTime, { message: 'Fin requerido' });
    },
    {
      submission: {
        action: async (fieldTree) => {
          try {
            const raw = fieldTree().value();
            const payload: CreateOfferRequest = {
              ...raw,
              parkingSpotId: raw.parkingSpotId ? raw.parkingSpotId : (null as any),
            };
            await firstValueFrom(this.offerService.createOffer(payload));
            alert('Oferta creada exitosamente');
            this.router.navigate(['/offer-list']);
          } catch (err: any) {
            alert(err?.error?.message || 'Error al crear la oferta');
          }
        },
      },
    },
  );

  loadAvailableSpots(): void {
    const lotId = this.offerForm.parkingLotId().value();
    const start = this.offerForm.startTime().value();
    const end = this.offerForm.endTime().value();

    if (!lotId || !start || !end) {
      this.availableSpots.set([]);
      return;
    }

    if (new Date(start) >= new Date(end)) {
      this.availableSpots.set([]);
      return;
    }

    this.offerService.getAvailableSpots(lotId, start, end).subscribe({
      next: (spots) => this.availableSpots.set(spots),
      error: (e) => {
        console.error('Error cargando plazas disponibles:', e);
        this.availableSpots.set([]);
      },
    });
  }
  ngOnInit(): void {
    this.parkingLotService.getMyParkingLots().subscribe({
      next: (lots) => this.myParkingLots.set(lots),
      error: (e) => console.error('Error cargando estacionamientos:', e),
    });
  }
}
