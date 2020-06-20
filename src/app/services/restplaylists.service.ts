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


 /** OK falta el filtro */ 
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


  addPlaylist(playlist: Playlist): Promise<Playlist> {
    console.log('[RESTPlayListsService] addPlaylist(' + JSON.stringify(playlist) + ')');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/playlists`;
      let params: any = { token: this.login.getToken() };
      this.http.post(url, playlist, { params: { token: this.login.getToken() } })
        .subscribe(
          (plaslist: Playlist) => { resolve(playlist); },
          (err) => { reject(err); }
        );
    });
  }

  updatePlaylist(playlist: Playlist): Promise<Video> {
    console.log('[RESTPlayListsService] updatePlaylist()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/playlists/${playlist.id}`;
      this.http.put(url, playlist, { params: { token: this.login.getToken() } })
        .subscribe(
          (video: Video) => { resolve(video); },
          (err) => { reject(err); }
        );
    });
  }

  removePlaylist(id: string): Promise<void> {
    console.log('[RESTPlayListsService] removePlaylist()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/playlists/${id}`;
      this.http.delete(url, { params: { token: this.login.getToken() } })
        .subscribe(
          () => { resolve(); },
          (err) => { reject(err); }
        );
    });
  }


  listVideos(playlistId: string): Promise<Video[]> {
    console.log('[RESTPlayListsService] listVideosPlaylist()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/playlists/${playlistId}/videos`;
      let params: any = { token: this.login.getToken() };
      this.http.get(url, { params: params })
        .subscribe(
          (videos: Video[]) => { resolve(videos); },
          (err) => { reject(err); }
        );
    });
  }

  removeVideo(playlistId: string, videoId: string): Promise<void>{
    console.log('[RESTPlayListsService] removevideo()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/playlists/${playlistId}/videos/${videoId}`;
      this.http.delete(url, { params: { token: this.login.getToken() } })
        .subscribe(
          () => { resolve(); },
          (err) => { reject(err); }
        );
    });
  }

  addVideo(playlistId: string, video: Video): Promise<void> {
    console.log('[RESTPlayListsService] addvideo()');
    let user = this.login.getUser();
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${user.id}/playlists/${playlistId}/videos`;
      let params: any = { token: this.login.getToken() };
      this.http.post(url, video, { params: { token: this.login.getToken() } })
        .subscribe(
          () => { resolve(); },
          (err) => { reject(err); }
        );
    });
  }
/*
  listVideos(playlistId: string): Promise<Video[]> {
    
    console.log(`[MemoryPlayListVideosService] listVideos})`);
    let _videos: Video[] = [];
    var index = this.Playlist.findIndex((playlist) => playlist.id === playlistId);
    if (index !== -1) {
      let _playlist_videos = this.Playlist[index].idVideos;
      for(let video of _playlist_videos){
        console.log(`video to add: ${video}`);
        this.Videos.findVideoById(video)
        .then((video) => {
          _videos.push(video);
        })
        .catch((err) => {
          console.log(`Error listVideos can't find. ${err}`);
        })
        ///////////////////////////
      }
    }
    return new Promise((resolve, reject) => {
       //resolve(this.videos);
       resolve(_videos);
    });
   }
*/
/*
 addPlaylist(playlist: Playlist): Promise<Playlist> {
  console.log('[MemoryPlayListsService] addVideo(' + JSON.stringify(playlist) +')');  
  playlist.id = String(this.nextId++);
  this.Playlist.push(playlist);
  return new Promise((resolve, reject) => {
    let _playlists = this.Playlist;
    resolve(playlist);
  });
 }

 removePlaylist(playlistId: string): Promise<void> {
  console.log(`[MemoryPlayListsService] removeVideo(${playlistId})`);
  var index = this.Playlist.findIndex((playlist) => playlist.id === playlistId);
  if (index !== -1) {
    this.Playlist.splice(index, 1);
    return new Promise((resolve, reject) => resolve());
  } else {
    return new Promise((resolve, reject) => reject(new Error(`PlayLists with id $  {playlistId} not found`)));
  }
 }

 updatePlaylist(playlist: Playlist): Promise<Playlist> {
  console.log('[MemoryPlayListsService] updatePlaylists(' + JSON.stringify(playlist) +
  ')');
  var index = this.Playlist.findIndex((_playlist) => _playlist.id === playlist.id);
    if (index !== -1) {
      playlist.date = String(new Date());
      this.Playlist[index] = this.clone(playlist);
      return new Promise((resolve, reject) => resolve(this.clone(playlist)));
    } else {
      return new Promise((resolve, reject) => reject(new Error(`Playlists with id ${playlist.id} not found`)));
    }
 }
*/


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
