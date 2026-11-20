import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingLotLayout } from './parking-lot-layout';

describe('ParkingLotLayout', () => {
  let component: ParkingLotLayout;
  let fixture: ComponentFixture<ParkingLotLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingLotLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingLotLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
