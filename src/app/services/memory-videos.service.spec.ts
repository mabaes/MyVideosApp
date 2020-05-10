import { TestBed } from '@angular/core/testing';

import { MemoryVideosService } from './memory-videos.service';

describe('MemoryVideosServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoryVideosService = TestBed.get(MemoryVideosService);
    expect(service).toBeTruthy();
  });
});
