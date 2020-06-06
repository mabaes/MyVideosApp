import { Injectable, PLATFORM_ID } from '@angular/core';
import { Video } from '../models/video';
import {Playlist} from '../models/playlist';
import { PlaylistsService } from './playlists.service';
import { PlaylistsPage } from '../playlists/playlists.page';
import {MemoryVideosService} from './memory-videos.service';
import { VideosService } from './videos.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryPlaylistsService extends PlaylistsService {
  private Playlist: Playlist[] = [];
  private videos: Video[] = [];
  private nextId = 0;
  private PlaylistVideos = [];
  constructor(private Videos: MemoryVideosService) { 

  ////
  super(); 
  /*
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
   */
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
        count: 3,
        idVideos: ['v1','v3','v2']
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
        count: 2,
        idVideos: ['19JFykPcKcQ','Vizly-6w5tU']
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

 
/** OK **/
 addVideo(playlistId: string, video: Video): Promise<void> {
  console.log('[MemoryPlayListsService] addVideo(' + JSON.stringify(playlistId) +  ')');
  //ver si está en la platlist el idvideo. Si está no lo añadimos
  var index = this.Playlist.findIndex((playlist) => playlist.id === playlistId);
  if (index !== -1) {
    let _playlist_item = this.Playlist[index];
    var index2 = _playlist_item.idVideos.findIndex((element) => element === video.id);
    if (index2 == -1 ) {
      _playlist_item.idVideos.push (video.id);
      _playlist_item.count =_playlist_item.count +1; 
      return new Promise((resolve, reject) => resolve());
    }
    else {
      return new Promise((resolve, reject) => reject(new Error(`Video with id ${video.id} was already added.`)));
    }
    //console.log(`[MemoryPlayListsService] addvideo in playlist ${_playlist_item.idVideos}`);
 
  } else {
    return new Promise((resolve, reject) => reject(new Error(`PlayLists with id ${playlistId} not found`)));
  }

 }

 
 /** OK **/
 removeVideo(playlistId: string, videoId: string): Promise<void>{
  console.log('[MemoryPlayListsService] removeVideo(' + JSON.stringify(playlistId) +
  ')');
  ///////////////
  var index = this.Playlist.findIndex((element) => element.id === playlistId);
  if (index !== -1) {
    let _playlist_item = this.Playlist[index];
    console.log(_playlist_item.idVideos);
    var index2 = _playlist_item.idVideos.findIndex((element) => element === videoId);
    console.log(index2);
    if (index2 !== -1 ) {
      //this.videos.splice(index, 1);
      _playlist_item.idVideos.splice (index2,1);
      _playlist_item.count =_playlist_item.count -1;
      if (_playlist_item.count<0) {
        _playlist_item.count =0;
      }
      this.Playlist[index].count = _playlist_item.count;
      this.Playlist[index].idVideos = _playlist_item.idVideos;
      return new Promise((resolve, reject) => resolve());
    }
    else {
      return new Promise((resolve, reject) => reject(new Error(`Video with id ${videoId} can't found.`)));
    }
    
  } else {
    return new Promise((resolve, reject) => reject(new Error(`PlayLists with id ${playlistId} not found`)));
  }
  ///////////////
 }
 

 /** OK **/
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
