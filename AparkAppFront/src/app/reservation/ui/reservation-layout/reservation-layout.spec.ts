import { ComponentFixture, TestBed } from '@angular/core/testing';
import ReservationLayout from './reservation-layout';

describe('ReservationLayout', () => {
  let component: ReservationLayout;
  let fixture: ComponentFixture<ReservationLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
