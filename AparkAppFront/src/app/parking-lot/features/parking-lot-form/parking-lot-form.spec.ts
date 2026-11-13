import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingLotForm } from './parking-lot-form';

describe('ParkingLotForm', () => {
  let component: ParkingLotForm;
  let fixture: ComponentFixture<ParkingLotForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingLotForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingLotForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
