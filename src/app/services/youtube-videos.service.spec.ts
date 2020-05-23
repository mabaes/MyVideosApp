import { TestBed } from '@angular/core/testing';

import { YoutubeVideosService } from './youtube-videos.service';

describe('YoutubeVideosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YoutubeVideosService = TestBed.get(YoutubeVideosService);
    expect(service).toBeTruthy();
  });
});
