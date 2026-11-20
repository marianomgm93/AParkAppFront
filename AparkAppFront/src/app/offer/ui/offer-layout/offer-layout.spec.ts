import { ComponentFixture, TestBed } from '@angular/core/testing';
import OfferLayout from './offer-layout';

describe('OfferLayout', () => {
  let component: OfferLayout;
  let fixture: ComponentFixture<OfferLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
