import { TestBed } from '@angular/core/testing';

import { RESTPlaylistsService } from './restplaylists.service';

describe('RESTPlaylistsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RESTPlaylistsService = TestBed.get(RESTPlaylistsService);
    expect(service).toBeTruthy();
  });
});
