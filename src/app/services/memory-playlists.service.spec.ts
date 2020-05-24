import { TestBed } from '@angular/core/testing';

import { MemoryPlaylistsService } from './memory-playlists.service';

describe('MemoryPlaylistsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoryPlaylistsService = TestBed.get(MemoryPlaylistsService);
    expect(service).toBeTruthy();
  });
});
