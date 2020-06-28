import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Video } from '../models/video';


@Injectable({
  providedIn: 'root'
})
export class RESTVideosService {

  private rootUrl = 'http://localhost:8087/myvideos';
  constructor(private login: UserService, private http: HttpClient) { }
  
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
      let params: any = { token: this.login.getToken(), q:query };
      this.http.get(url, { params: params })
        .subscribe(
          (video: Video[]) => { resolve(video); },
          (err) => { reject(err); }
        );
    });
  }

  /** nuevo */
 findVideoById(id:string): Promise<Video[]> {
  console.log(`[RESTvideosService] findVideoById(${id})`);
  let user = this.login.getUser();
  return new Promise((resolve, reject) => {
    let url = this.rootUrl + `/users/${user.id}/videos/${id}`;
    let params: any = { token: this.login.getToken(), videoId:id, userId: user.id };
    this.http.get(url, { params: params })
      .subscribe(
        (video: Video[]) => { resolve(video); },
        (err) => { reject(err); }
      );
  });
}

  updateVideo(video: Video): Promise<Video> {
    console.log('[RESTvideosService] updateVideo()');
    console.log(video);
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/videos/${video.id}`;
      this.http.put(url, video, { params: { token: this.login.getToken() } })
        .subscribe(
          (video: Video) => { resolve(video); },
          (err) => { reject(err); }
        );
    });
  }

  removeVideo(id: string): Promise<void> {
    console.log('[RESTvideosService] removeVideo()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/videos/${id}`;
      this.http.delete(url, { params: { token: this.login.getToken() } })
        .subscribe(
          () => { resolve(); },
          (err) => { reject(err); }
        );
    });
  }

  shareVideo(video: Video): Promise<void> {
    console.log(`[RESTvideosService] shareVideo(${video.id})`);
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      ///myvideos/users/:userId/videos/:videoId/share
      let url = this.rootUrl + `/users/${user.id}/videos/${video.id}/share`;
      let params: any = { token: this.login.getToken(), videoId:video.id, userId: user.id };
      this.http.get(url, { params: params })
        .subscribe(
          () => { resolve(); },
            (err) => { reject(err); }
        );
    });
  }
}
