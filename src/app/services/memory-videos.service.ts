import { Injectable } from '@angular/core';
import { Video } from '../models/video';
import { VideosService } from './videos.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryVideosService extends VideosService {
  private videos: Video[] = [];
  private nextId = 0;

  ////////////////////////
  /*
  private locations: WeatherLocation[] = [];
constructor() {
this.locations.push({
id: 100,
lat: 38.71,
lon: -0.47,
name: 'Alcoy',
country: 'ES'
});
*/
  //////////////////

  constructor() { 
    super(); 
    
    this.videos.push(
      {
        id:'ewrwewe',
        type:'local',
        url:'http://loquesea.com',
        title:'Titulo de pruebaa',
        description:'descripción del vudeo que vamos a ver',
        
        tags:'video, gracioso, aniversario',
        duration:'30seg',
        date:'25/febrero/2020',
        width:450,
       
      },
      {
        id:'ewrwewe',
        type:'local',
        url:'http://loquesea.com',
        title:'video dos',
        description:'que es lo que vamos a ver',
        
        tags:'video, gracioso, aniversario',
        duration:'30seg',
        date:'25/febrero/2020',
        width:450,
       
      }
    )
  }

  findVideos(query: string): Promise<Video[]> {
    console.log(`[MemoryVideosService] findVideos(${query})`);
    return new Promise((resolve, reject) => {
      let _videos = this.videos.filter((video) => {
        return video.title.indexOf(query) !== -1;
      }).map((video) => this.clone(video));
      resolve(_videos);
    });
  }


  findVideoById(id: string): Promise<Video> {
    console.log(`[MemoryVideosService] findVideoById(${id})`);
    var index = this.videos.findIndex((video) => video.id === id);
    return new Promise((resolve, reject) => {
      resolve((index === -1) ? null : this.clone(this.videos[index]));
    });
  }

  addVideo(video: Video): Promise<Video> {
    console.log('[MemoryVideosService] addVideo(' + JSON.stringify(video) +')');
    let _video = this.clone(video);
    _video.id = String(this.nextId++);
    this.videos.push(_video);
    return new Promise((resolve, reject) => resolve(this.clone(_video)));
  }

  removeVideo(id: string): Promise<void> {
    console.log(`[MemoryVideosService] removeVideo(${id})`);
    var index = this.videos.findIndex((video) => video.id === id);
    if (index !== -1) {
      this.videos.splice(index, 1);
      return new Promise((resolve, reject) => resolve());
    } else {
      return new Promise((resolve, reject) => reject(new Error(`Video with id $  {id} not found`)));
    }
  }


  updateVideo(video: Video): Promise<Video> {
    console.log('[MemoryVideosService] updateVideo(' + JSON.stringify(video) +
      ')');
    var index = this.videos.findIndex((_video) => _video.id === video.id);
    if (index !== -1) {
      this.videos[index] = this.clone(video);
      return new Promise((resolve, reject) => resolve(this.clone(video)));
    } else {
      return new Promise((resolve, reject) => reject(new Error(`Video with id ${video.id} not found`)));
    }
  }

  private clone(video: Video): Video {
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

} //end class
