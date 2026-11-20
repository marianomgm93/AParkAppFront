import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OfferService } from '../../data-acces/offer.service';
import { ROUTE_COMMANDS } from '../../../app.route.segments';
import { OfferModel } from '../../data-acces/offer';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-offer-detail',
  styleUrl: './offer-detail.css',
  templateUrl: './offer-detail.html',
})
export default class OfferDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly offerService = inject(OfferService);
  protected readonly commands = ROUTE_COMMANDS;
  readonly offer = signal<OfferModel | undefined>(undefined);
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.offerService.getById(id).subscribe({
        next: (data) => this.offer.set(data),
        error: (err) => alert(err?.error?.message || 'Error al cargar la oferta'),
      });
    }
  }
}
