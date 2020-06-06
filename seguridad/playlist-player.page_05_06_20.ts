import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Playlist } from '../models/playlist';

import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import {MemoryPlaylistsService} from '../services/memory-playlists.service';
import { Video } from '../models/video';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-playlist-player',
  templateUrl: './playlist-player.page.html',
  styleUrls: ['./playlist-player.page.scss'],
})
export class PlaylistPlayerPage implements OnInit {
  @Input()
  private playlist: Playlist;
  private videoSource : any;
  private idVideoSource : string;
  private type :string;
  //private videoplayer: ElementRef;
  videoElement: HTMLVideoElement;
  
  @ViewChild('videoPlayer', { static: false }) mVideoPlayer: any;
 


  constructor( private playlists: MemoryPlaylistsService, private modalCtrl: ModalController,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    //this.videoSource = "/assets/videos/Star.mp4";
    this.playlists.listVideos(this.playlist.id)
    .then((_videos) => {
      console.log('[PlaylistPlayerPage] listvideos');
      console.log(_videos);
      this.videoSource = _videos[0].url;
      this.idVideoSource = _videos[0].id;
      this.type = _videos[0].type;
      if(this.type =='youtube') {
        //domSanitizer.bypassSecurityTrustResourceUrl(video.url)
        this.videoSource = this.domSanitizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/'+_videos[0].id+'?autoplay=0');
      }
      /*
      for(let video of _videos){
        //console.log(video.url);
        this.videoSource = video.url;
        this.idVideoSource = video.id;
         
      }
      */
      //this.myVideos = _videos;
    })
    .catch((err) => {
      console.log(err);
    })
  }

  close() {
    console.log('[PlaylistPlayer] close()');
    this.modalCtrl.dismiss();
  }

  nextVideo(idVideoSource, event) {
    console.log('siguiente video');
    console.log(this.idVideoSource);    
    /////////////////////
    this.playlists.listVideos(this.playlist.id)
    .then((_videos) => {
      console.log('[PlaylistPlayerPage] listvideos');
      console.log(_videos);
      let encontrado : boolean;
      let previo : boolean;
      encontrado = false;
      previo = false;
      let index =  _videos.findIndex((element => element.id === this.idVideoSource));
      let nextindex = index+1;
      let _nextvideo = _videos[nextindex];
      this.videoSource = _nextvideo.url;
      this.idVideoSource = _nextvideo.id;
      //let x = document.querySelector('#videoPlayer video');//document.getElementById("reproVideo");
      //console.log(x);
      //x.play();
      //event.toElement.play();
      //this.videoplayer.nativeElement.play();
      /* OK
      let video = this.mVideoPlayer.nativeElement;
      video.src = _nextvideo.url;
      video.play();
      */

      //https://stackoverflow.com/questions/44622979/html5-video-play-not-playing-ionic-3-ios-and-android
      //https://www.w3schools.com/tags/ref_eventattributes.asp
      //https://forum.ionicframework.com/t/html5-video-playing-a-local-mp4-video-on-ios/104930
      
      console.log(_nextvideo);
      /*
      for(let video of _videos){
        //console.log(video.url);

        if (video.id==idVideoSource) {
          encontrado = true;

        }
        
        this.videoSource = video.url;
        this.idVideoSource = video.id;
         
      }
      */
      //this.myVideos = _videos;
    })
    .catch((err) => {
      console.log(err);
    })
    ////////////////////
  }
}
