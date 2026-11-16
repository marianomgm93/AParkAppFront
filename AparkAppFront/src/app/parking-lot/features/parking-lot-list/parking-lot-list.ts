import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingLotService } from '../../data-access/parking-lot.service';
import { ParkingLotModel } from '../../data-access/parking-lot.model';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  selector: 'app-parking-lot-list',
  styleUrl: './parking-lot-list.css',
  templateUrl: './parking-lot-list.html',
})

export default class ParkingLotList implements OnInit {
  private readonly service = inject(ParkingLotService);
  private readonly router = inject(Router); 
  private readonly parkingLots = signal<ParkingLotModel[]>([]);
  readonly sortedParkingLots = computed(() =>
    [...this.parkingLots()].sort((a, b) => a.name.localeCompare(b.name))
  );

  ngOnInit() {
    this.service.getAllParkingLots().subscribe((list) => this.parkingLots.set(list));
  }

  edit(id: string | number) {
    this.router.navigate(['/parkingLotForm', id]);
  }
  delete(id: string | number) {
    this.service.deleteParkingLot(id).subscribe(() => {
      this.parkingLots.update((list) => list.filter((p) => p.id !== id));
    });
  }
}

