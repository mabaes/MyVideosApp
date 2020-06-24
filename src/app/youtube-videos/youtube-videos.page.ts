import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Video } from '../models/video';
//import { VideosService } from '../services/videos.service';
import { RESTVideosService } from '../services/restvideos.service';
import {YoutubeVideosService} from '../services/youtube-videos.service';
import {  ModalController, ActionSheetController,AlertController } from '@ionic/angular';
import { VideoEditorPage } from '../video-editor/video-editor.page';
import { OverlayEventDetail } from '@ionic/core';

import { VideoPlayerPage } from '../video-player/video-player.page';
import {PlaylistsSelectorPage} from '../playlists-selector/playlists-selector.page'


@Component({
  selector: 'app-youtube-videos',
  templateUrl: './youtube-videos.page.html',
  styleUrls: ['./youtube-videos.page.scss'],
})
export class YoutubeVideosPage implements OnInit {
  public query = '';
  public myVideos: Video[] = [];
  private win: any = window;

  constructor(private videos: YoutubeVideosService, 
      private changes: ChangeDetectorRef,
      private modalCtrl: ModalController,
      private actionSheetCtrl: ActionSheetController, private listaVideos: RESTVideosService,
      private alertCtrl:AlertController) { }

  ngOnInit() {
    console.log('ngOnInit YoutubeVideosPage pulsa para buscar');
    //this.searchVideos();
  
  }
  searchVideos(evt?) {
    console.log('[YoutubeVideosPage] searchVideos()');
    let query = evt ? evt.target.value.trim() : this.query;
    console.log(`Query ${query}`);    
    this.videos.findVideos(query) 
      .then((videos) => {
        this.myVideos = videos
        console.log('[MyVideosPage] searchYouVideos() => ' +
          JSON.stringify(this.myVideos));
          this.changes.detectChanges();                  
      });
      
    /*
    this.videos.findVideos(query)
      .then((videos) => {
        this.myVideos = videos
        console.log('[MyVideosPage] searchVideos() => ' +
          JSON.stringify(this.myVideos));
        this.changes.detectChanges();
      });
      */

  }

  playVideo(video: Video) {
    console.log(`[YoutubeVideosPage] playVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoPlayerPage,
      componentProps: { video: video }
    }).then((modal) => modal.present());
  }

  editVideo(video: Video) {
    console.log(`[YoutubeVideosPage] editVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoEditorPage,
      componentProps: { mode: 'view', video: video }
    })
      .then((modal) => {
        modal.onDidDismiss()
          .then((evt: OverlayEventDetail) => {
            if (evt && evt.data) {
              this.videos.updateVideo(evt.data)
                .then(() => this.searchVideos());
            }
          });
        modal.present();
      });
  }//edit video

  showMenu(video) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Add Playlist',
          icon: 'star',
          handler: () => {
            console.log('Add Playlist');
            this.addPlaylist(video);
          }
        },
        {
          text: 'Play',
          icon: 'play',
          handler: () => {
            console.log('Play video');
            this.playVideo(video);
          }
        },
        {
          text: 'Properties',
          icon: 'information-circle',
          handler: () => {
            console.log('Properties youtube video!!');
            this.editVideo(video);
          }
        },        

      ]
    }).then((actionSheet) => actionSheet.present());
  } //showmenu


  addPlaylist(video:Video){
    console.log(`[YoutubeVideosPage] addPlaylist(${video.id})`);
    //this.videos.addVideo(video);
    this.listaVideos.addVideo(video)
      .then((videoAdd) => {
        console.log('REspuesta addVideo:');
        console.log(videoAdd);
        this.modalCtrl.create({
          component: PlaylistsSelectorPage,
          componentProps: { video: videoAdd }
        })
        .then((modal) => {
          modal.onDidDismiss()
            .then((evt: OverlayEventDetail) => {
              
            });
          modal.present();
        });
      }
      )
      .catch((err) => {
        this.alertCtrl.create({
          header: 'Error',
          message: 'Error adding  video to DB:' + JSON.stringify(err),
          buttons: ['OK']
        }).then((alert) => alert.present());
      });
    
    
  }
/*
  addPlaylist(video:Video){
    console.log(`[YoutubeVideosPage] addPlaylist(${video.id})`);
    this.videos.addVideo(video);
    // add video a  la lista de videos
    this.listaVideos.addVideo(video)
     .then(() => console.log(this.listaVideos))
     //////////////////////////////////////////
      .catch((err) => {
        // Handle error
        this.alertCtrl.create({
          header: 'Error',
          message: 'Error adding  video to playlist:' + JSON.stringify(err),
          buttons: ['OK']
        }).then((alert) => alert.present());
      });
   
     /////////////////////////////////////////
     
    
    this.modalCtrl.create({
      component: PlaylistsSelectorPage,
      //componentProps: { idVideo: video.id }
      componentProps: { video: video }
    })
    .then((modal) => {
      modal.onDidDismiss()
        .then((evt: OverlayEventDetail) => {
          
          //if (evt && evt.data) {
            //this.videos.updateVideo(evt.data)
              //.then(() => this.searchVideos());
          //} 
        });
      modal.present();
    });
  }
  */
}
