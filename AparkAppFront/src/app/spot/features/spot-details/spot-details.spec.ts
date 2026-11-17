import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotDetails } from './spot-details';

describe('SpotDetails', () => {
  let component: SpotDetails;
  let fixture: ComponentFixture<SpotDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SpotDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
