import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video';

///////////////////////////////////////////////
import {Playlist} from '../models/playlist';
import { PlaylistsService } from './playlists.service';
import { PlaylistsPage } from '../playlists/playlists.page';
//import {MemoryVideosService} from './memory-videos.service';
import { RESTVideosService } from './restvideos.service';

//////////////////////////////////////////////

///////////////////////////////////////////////



@Injectable({
  providedIn: 'root'
})
export class RESTPlaylistsService {

  private rootUrl = 'http://localhost:8087/myvideos';
  private Playlist: Playlist[] = [];
  private videos: Video[] = [];
  private nextId = 0;
  private PlaylistVideos = [];
  constructor(private login: UserService, private http: HttpClient, private Videos: RESTVideosService) { }


  
 findPlaylists(query?:string):Promise<Playlist[]> {
 console.log(`[RESTPlayListVideosService] findPlaylsits`);
 let user = this.login.getUser();
 return new Promise((resolve, reject) => {
   let url = this.rootUrl + `/users/${user.id}/playlists`;
   let params: any = { token: this.login.getToken() };
   this.http.get(url, { params: params })
     .subscribe(
       (playlist: Playlist[]) => { resolve(playlist); },
       (err) => { reject(err); }
     );
 });
}
  
  /*
  addVideo(video: Video): Promise<Video> {
    console.log('[RESTvideosService] addVideo()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/videos`;
      this.http.post(url, video, { params: { token: this.login.getToken() } })
        .subscribe(
          (video: Video) => { resolve(video); },
          (err) => { reject(err); }
        );
    });
  }

  findVideos(query:string): Promise<Video[]> {
    console.log(`[RESTvideosService] findVideos`);
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/videos`;
      let params: any = { token: this.login.getToken() };
      this.http.get(url, { params: params })
        .subscribe(
          (video: Video[]) => { resolve(video); },
          (err) => { reject(err); }
        );
    });
  }
  */
}
