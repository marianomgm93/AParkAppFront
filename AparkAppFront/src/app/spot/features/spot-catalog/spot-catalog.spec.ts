import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotCatalog } from './spot-catalog';

describe('SpotCatalog', () => {
  let component: SpotCatalog;
  let fixture: ComponentFixture<SpotCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(SpotCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
