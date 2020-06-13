import { Injectable } from '@angular/core';
import { Video } from '../models/video';
import { VideosService } from './videos.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryVideosService extends VideosService {
  private videos: Video[] = [];
  private nextId = 0;

  
  constructor() { 
    super(); 
    
    this.videos.push(
      {
        id:'v1',
        type:'local',
        url:'/assets/videos/Mountains.mp4',
        title:'Montañas',
        description:'Descubir las montañas de una forma única',
        tags:'relax, naturaleza, montañas',
        duration:'13seg',
        date:'12/04/2020',
        width:450,
        thumbnail: {
          url:'assets/videos/Mountains.jpg',
          width:200,
          height:150
        }
       
      },
      {
        id:'v2',
        type:'local',
        url:'/assets/videos/Snowy.mp4',
        title:'Nevando',
        description:'La naturaleza nos brinda imágenes preciosas de la nieve',
        tags:'relax, nevar, naturaliza, nieve',
        duration:'27seg',
        date:'12/12/2019',
        width:450, 
        thumbnail: {
          url:'assets/videos/Snowy.jpg',
          width:200,
          height:150
        }      
        
        
      },
      {
        id:'v3',
        type:'local',
        url:'/assets/videos/Robin.mp4',
        title:'Pájaros cantores',
        description:'Los pájaros cantores aportan sonidos al espacio natural',
        tags:'pájaros, colores, naturaleza, sonidos',
        duration:'20seg',
        date:'15/05/2020',
        width:450,       
        thumbnail: {
          url:'assets/videos/Robin.jpg',
          width:200,
          height:150
        }
      },
      {
        id:'v4',
        type:'local',
        url:'/assets/videos/Star.mp4',
        title:'Las estrellas',
        description:'Contemplar las estrellas en el cielo',
        tags:'estrellas, universo, cielo, planeta, naturaleza',
        duration:'30seg',
        date:'15/03/2020',
        width:450,       
        thumbnail: {
          url:'assets/videos/Star.jpg',
          width:200,
          height:150
        }
      },
      {
        id:'EuZBbjRHgLk',
        type:'youtube',
        url:'https://www.youtube.com/watch?v=EuZBbjRHgLk',
        title:'Perros Castigados - Video para Estado de WhatsApp',
        description:'Perros castigados después de sacar las zapatillas',
        tags:'perros, gracioso, animales',
        duration:'30seg',
        date:'22/03/2020',
        width:450,       
        thumbnail: {
          url:'assets/videos/perros.jpg',
          width:200,
          height:150
        }
      },
      {
        id:'Vizly-6w5tU',
        type:'youtube',
        url:'https://www.youtube.com/watch?v=Vizly-6w5tU',
        title:'Osito panda estornuda y asusta a la madre',
        description:'Menudo susto le dá este pequeños a su madre',
        tags:'panda, gracioso, animales, susto',
        duration:'12seg',
        date:'22/01/2019',
        width:450,       
        thumbnail: {
          url:'assets/videos/oso-panda.jpg',
          width:200,
          height:150
        }
      },
      {
        id:'v5',
        type:'local',
        url:'/assets/videos/girl-happy.mp4',
        title:'La felicidad',
        description:'La primareva y la felicicdad',
        tags:'campo,naturaleza, felicidad, flores',
        duration:'120seg',
        date:'15/03/2020',
        width:450,       
        thumbnail: {
          url:'assets/videos/girl-happy.jpg',
          width:200,
          height:150
        }
      },
      

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
    if(_video.type!='youtube') {
      _video.id = String(this.nextId++);
    }
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
