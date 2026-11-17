import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotCatalog } from './spot-catalog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('SpotCatalog', () => {
  let component: SpotCatalog;
  let fixture: ComponentFixture<SpotCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotCatalog],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
