import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingSpotLayout } from './parking-spot-layout';

describe('ParkingSpotLayout', () => {
  let component: ParkingSpotLayout;
  let fixture: ComponentFixture<ParkingSpotLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpotLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpotLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
