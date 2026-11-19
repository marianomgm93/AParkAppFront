import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotDetails } from './spot-details';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('SpotDetails', () => {
  let component: SpotDetails;
  let fixture: ComponentFixture<SpotDetails>;

  beforeEach(async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [SpotDetails],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'spots', component: DummyComponent }])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
