import { Component, OnInit, Input, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
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


  /*** api ***/
  /* 1. Some required variables which will be used by YT API*/
  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;
  isRestricted = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  public toggleShowHide: string = "block";
  public localvideoStyle: string ; //"width:0%; height:0%";
  public showVideo : boolean= false;

 
  /*** end api ***/


  @ViewChild('videoPlayer', { static: false }) mVideoPlayer: any;
 
  constructor( private playlists: MemoryPlaylistsService, private modalCtrl: ModalController,
    private domSanitizer: DomSanitizer, private changes: ChangeDetectorRef) { }

    /*
    ngOnInit() {
      this.video = '19JFykPcKcQ';//'nRiOw3qGYq4';
      this.init();
    }
    */
    /*** API *** **/
     /* 2. Initialize method for YT IFrame API */
  init(video:string) {
    this.localvideoStyle = "display:none";
    //this.showVideo = false;
    // Return if Player is already created
   
    if (window['YT']) {
      console.log('start video with player set');
      this.startVideo(video);
      return;
    }
    
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    console.log(`init parameters ${video}`);
    /* 3. startVideo() will create an <iframe> (and YouTube player) after the API code downloads. */
    window['onYouTubeIframeAPIReady'] = () => this.startVideo(video);
   
  }
  startVideo(video:string) {
    console.log('video config for video'+ video);
    this.reframed = false;
    this.player = new window['YT'].Player('player', {
      videoId: video,//this.video,
      width:'100%',
      height:'100%',
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1

      },
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this),
        'onError': this.onPlayerError.bind(this),
        'onReady': this.onPlayerReady.bind(this),
      }
    });
    //console.log('player');
    //console.log(this.player);
  }

  /* 4. It will be called when the Video Player is ready */
  onPlayerReady(event) {
    console.log('player ready');
    if (this.isRestricted) {
      event.target.mute();
      event.target.playVideo();
    } else {
      event.target.playVideo();
    }
  }

  /* 5. API will call this function when Player State changes like PLAYING, PAUSED, ENDED */
  onPlayerStateChange(event) {
    console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime())
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended '+ this.video);
        this.nextVideo(this.video,event);
        //event.target.loadVideoById('nRiOw3qGYq4');
        //event.target.playVideo();
        break;
    };
  };

  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };
    /*** END API */

  
  ngOnInit() {
    //this.toggleShowHide ='none';
    //this.showVideo = true;
    console.log(this.showVideo);
    this.playlists.listVideos(this.playlist.id)
    
    .then((_videos) => {
      console.log('[PlaylistPlayerPage] listvideos');
      console.log(_videos);
      this.type = _videos[0].type;
      if(this.type =='youtube') {
        this.showVideo = false;
        this.changes.detectChanges();
        this.video =  _videos[0].id;//'19JFykPcKcQ';//'nRiOw3qGYq4';
        this.init(this.video);

      } else {
        this.showVideo = true;
        this.localvideoStyle ="display:block";
        this.changes.detectChanges();
        
        this.videoSource = _videos[0].url;
        this.idVideoSource = _videos[0].id;
      }
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
      let _max_videos : number;
      _max_videos = _videos.length;
      let index =  _videos.findIndex((element => element.id === idVideoSource));
      let nextindex = index+1;
      let _nextvideo = _videos[nextindex];
      //this.videoSource = _nextvideo.url;
      //this.idVideoSource = _nextvideo.id;
      console.log('nextindex'+nextindex+' max_videos'+_max_videos);
      if(nextindex<_max_videos) {
          this.type = _nextvideo.type;
        console.log(`next video: ${_nextvideo.id}`)
        if(this.type =='youtube') {
          this.showVideo = false;
          //let tamanyo = event.target.setSize('100%','100%' );
          this.video =  _nextvideo.id;
          if (window['YT']) {
            this.player.setSize('100%','100%' );
            this.changes.detectChanges();            
            //event.target.loadVideoById(this.video); 
            //event.target.playVideo();
            this.player.loadVideoById(this.video); 
            this.player.playVideo();
          }else {
            this.init(this.video);
          }
        }
        else {
          //this.toggleShowHide ='hidden';          
          //this.player.style.display = "none";
          //this.toggleShowHide ='none';
          this.showVideo = true; 
          if (window['YT']!=undefined) {
            let tamanyo = this.player.setSize(10,10 );//event.target.setSize(10,10 );
          }  
          this.localvideoStyle ="width:100%; height:100%";
          console.log('entro en else');
          this.changes.detectChanges();
          this.videoSource = _nextvideo.url;
          this.idVideoSource = _nextvideo.id;      
          let video = this.mVideoPlayer.nativeElement;
          video.src = _nextvideo.url;
          video.play();      
        }
      }
      

      //https://stackoverflow.com/questions/44622979/html5-video-play-not-playing-ionic-3-ios-and-android
      //https://www.w3schools.com/tags/ref_eventattributes.asp
      //https://forum.ionicframework.com/t/html5-video-playing-a-local-mp4-video-on-ios/104930
      
      console.log(_nextvideo);
     
    })
    .catch((err) => {
      console.log(err);
    })
    ////////////////////
  }
}
