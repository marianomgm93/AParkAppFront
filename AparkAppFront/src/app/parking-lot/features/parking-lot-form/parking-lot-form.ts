import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ParkingLotService } from '../../data-access/parking-lot.service';
import { ParkingLotModel, ParkingLotModelForForm } from '../../data-access/parking-lot.model';

@Component({
  imports: [],
  selector: 'app-parking-lot-form',
  styleUrl: './parking-lot-form.css',
  templateUrl: './parking-lot-form.html',
})
export class ParkingLotForm implements OnInit{

  private readonly client=inject(ParkingLotService);
  readonly editingParkingLot=input<ParkingLotModel>();
  readonly editedParkingLot=output<ParkingLotModel>();


  private readonly emptyParkingLot:ParkingLotModelForForm=
  {
    name:'',
    active:false,
    capacity:Number.NaN,
    user:null,
    address:null,

  };

  private readonly parkingLotFormModel=signal({...this.emptyParkingLot});  
  protected readonly isEditing=computed(()=>this.editingParkingLot()!==undefined);


  ngOnInit() {
    const editingParkingLot=this.editingParkingLot();
    if(this.isEditing()&&editingParkingLot)
    {
      this.parkingLotFormModel.set(editingParkingLot);

    }
      
  }

  




}
