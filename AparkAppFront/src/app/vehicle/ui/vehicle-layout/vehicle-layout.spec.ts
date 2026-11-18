import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleLayout } from './vehicle-layout';

describe('VehicleLayout', () => {
  let component: VehicleLayout;
  let fixture: ComponentFixture<VehicleLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
