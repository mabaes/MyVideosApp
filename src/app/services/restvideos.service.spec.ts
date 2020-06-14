import { TestBed } from '@angular/core/testing';

import { RESTVideosService } from './restvideos.service';

describe('RESTVideosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RESTVideosService = TestBed.get(RESTVideosService);
    expect(service).toBeTruthy();
  });
});
