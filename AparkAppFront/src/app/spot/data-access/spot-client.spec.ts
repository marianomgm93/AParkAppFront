import { TestBed } from '@angular/core/testing';
import { ParkingSpotService} from '../data-access/spot-client';

describe('SpotClient', () => {
  let service: ParkingSpotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingSpotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
