import { Injectable, PLATFORM_ID } from '@angular/core';
import { Video } from '../models/video';
import {Playlist} from '../models/playlist';
import { PlaylistsService } from './playlists.service';
import { PlaylistsPage } from '../playlists/playlists.page';
import {MemoryVideosService} from './memory-videos.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryPlaylistsService extends PlaylistsService {
  private Playlist: Playlist[] = [];
  private videos: Video[] = [];
  private nextId = 0;
  private PlaylistVideos = [];
  constructor() { 

  ////
  super(); 
   this.PlaylistVideos.push (
     {
       idPlayList : 'pl-1',
       idVideos : ['2','4','3']
     },
     {
      idPlayList : 'pl-2',
      idVideos : ['2','3']
    }
   );
    this.Playlist.push (
      {
        id:'pl-1',
        title: 'canciones rock',
        description: 'las mejores canciones que hay ahora mismos',
        thumbnail : {
          url: '/assets/portada-rock.jpg',
          width: 100,
          height: 400
        },
        date: '12/12/2020',
        count: 6,
        idVideos: ['v1','v3']
      },
      {
        id:'pl-2',
        title: 'videos graciosos',
        description: 'las mejores videos graciososo',
        thumbnail : {
          url: '',
          width: 100,
          height: 100
        },
        date: '15/2/2020',
        count: 4
      }

    );
     
    
  }
  /////

  /*
  abstract findPlaylists(): Promise<Playlist[]>;
  abstract addPlaylist(playlist: Playlist): Promise<Playlist>;
  abstract removePlaylist(playlistId: string): Promise<void>;
  abstract updatePlaylist(playlist: Playlist): Promise<Playlist>;
  abstract addVideo(playlistId: string, video: Video): Promise<void>;
  abstract removeVideo(playlistId: string, videoId: string): Promise<void>;
  abstract listVideos(playlistId: string): Promise<Video[]>;
  */

/** OK */
 findPlaylists():Promise<Playlist[]> {
    console.log(`[MemoryPlayListVideosService] findPlaylsits})`);
    return new Promise((resolve, reject) => {
      let _playlists = this.Playlist;
      resolve(_playlists);
    });
 }

 /* OK */
 addPlaylist(playlist: Playlist): Promise<Playlist> {
  console.log('[MemoryPlayListsService] addVideo(' + JSON.stringify(playlist) +')');  
  playlist.id = String(this.nextId++);
  this.Playlist.push(playlist);
  return new Promise((resolve, reject) => {
    let _playlists = this.Playlist;
    resolve(playlist);
  });
 }

  /* OK */
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

/** OK **/
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

 //REVISAR : añade el vídeo especificado a la lista de reproducción especificada
 addVideo(playlistId: string, video: Video): Promise<void> {
  console.log('[MemoryPlayListsService] addVideo(' + JSON.stringify(playlistId) +
  ')');
  return new Promise((resolve, reject) => resolve());
 
 }

 //REVISAR :
 removeVideo(playlistId: string, videoId: string): Promise<void>{
  console.log('[MemoryPlayListsService] removeVideo(' + JSON.stringify(playlistId) +
  ')');
  return new Promise((resolve, reject) => resolve());
 }

 //REVISAR:
 listVideos(playlistId: string): Promise<Video[]> {
  console.log(`[MemoryPlayListVideosService] listVideos})`);
  return new Promise((resolve, reject) => {
     resolve(this.videos);
  });
 }

 private clone(playlist: Playlist): Playlist {
  return {
    id: playlist.id,   
    title: playlist.title,
    description: playlist.description,
    thumbnail: playlist.thumbnail,
    date: playlist.date,
    count:playlist.count
  };
}


 /*

 
 

 /*
 private clone(playlist: Playlist): Playlist {
  return {
    id: video.id,
    type: video.type,
    url: video.url,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail,
    tags: video.tags,
    duration: video.duration,
    date: video.date,
    width: video.width,
    height: video.height
  };
}
*/

  /*
  findVideos(query: string): Promise<Video[]> {
    console.log(`[MemoryVideosService] findVideos(${query})`);
    return new Promise((resolve, reject) => {
      let _videos = this.videos.filter((video) => {
        return video.title.indexOf(query) !== -1;
      }).map((video) => this.clone(video));
      resolve(_videos);
    });
  }
  */

}
