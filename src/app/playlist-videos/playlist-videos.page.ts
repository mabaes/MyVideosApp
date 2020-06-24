import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Video } from '../models/video';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
//import {MemoryPlaylistsService} from '../services/memory-playlists.service';
import { RESTPlaylistsService } from '../services/restplaylists.service';
import { YoutubeVideosService } from '../services/youtube-videos.service';
import { RESTVideosService } from '../services/restvideos.service';

import { VideoPlayerPage } from '../video-player/video-player.page';
import { VideoEditorPage } from '../video-editor/video-editor.page';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-playlist-videos',
  templateUrl: './playlist-videos.page.html',
  styleUrls: ['./playlist-videos.page.scss'],
})
export class PlaylistVideosPage implements OnInit {
  @Input()
  private playlist: Playlist;
  public myVideos: Video[] = [];

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController,
    private playlists: RESTPlaylistsService, private actionSheetCtrl: ActionSheetController,
    private changes: ChangeDetectorRef,
    private youtubeVideos: YoutubeVideosService,
    private videos: RESTVideosService) { }

  ngOnInit() {
    console.log(`[PlaylistVideosPage ${this.playlist.id}]`);
    ///////////////
    this.playlists.listVideos(this.playlist.id)
      .then((_videos) => {
        console.log('[PlaylistVideosPage] listvideos');
        console.log(_videos);
        let _videosTmp: Video[] = [];
        for (let video_item of _videos) {
          console.log(video_item.type)
          if (video_item.type === 'youtube') {
            this.videos.findVideoById(video_item.id)
              .then((_video) => {
                let _urlTmp = _video[0].url.split('/');
                let _idVideoYouTube = _urlTmp[_urlTmp.length - 1];
                //console.log(_idVideoYouTube);
                //console.log(_video);
                //////////////////////////////////////////
                this.youtubeVideos.findVideoById(_idVideoYouTube)
                  .then((_video) => {
                    console.log('[Youtubevideo] result');
                    console.log(_video);
                    _videosTmp.push(_video);
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                //////////////////////////////////////////
              })
              .catch((err) => {
                console.log(err);
              })

          } else {
            _videosTmp.push(video_item)
          }
        }

        //this.myVideos = _videos;
        this.myVideos = _videosTmp;
      })
      .catch((err) => {
        console.log(err);
      })


  }

  reorder(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    const itemMove = this.myVideos.splice(event.detail.from, 1)[0];
    console.log(itemMove);
    this.myVideos.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
    console.log(this.myVideos);
    console.log(this.playlist);
    //this.playlist.idVideos = [];
    this.playlist.idVideos.length = 0;


    for (let myvideo_item of this.myVideos) {
      this.playlist.idVideos.push(myvideo_item.id);
    };
    console.log(this.playlist);
    this.changes.detectChanges();

  }

  close() {
    console.log('[PlaylistsVideosPage] close()');
    this.modalCtrl.dismiss();
  }

  showMenu(video) {
    this.actionSheetCtrl.create({
      buttons: [

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
            console.log('Properties  video!!');
            this.editVideo(video);
          }
        },
        {
          text: 'Remove',
          icon: 'trash',
          handler: () => {
            console.log('Delete video!!');
            this.deleteVideo(this.playlist, video);
          }

        }, // delete

      ]
    }).then((actionSheet) => actionSheet.present());
  } //showmenu



  playVideo(video: Video) {
    console.log(`[MyVideosPage] playVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoPlayerPage,
      componentProps: { video: video }
    }).then((modal) => modal.present());
  }

  editVideo(video: Video) {
    console.log(`[PlaylistVideosPage] editVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoEditorPage,
      componentProps: { mode: 'view', video: video }
    })
      .then((modal) => {
        modal.onDidDismiss()
          .then((evt: OverlayEventDetail) => {
          });
        modal.present();
      });
  }//edit video

  deleteVideo(playlist: Playlist, video: Video) {
    console.log(`[PlaylistVideosPage] deleteVideo(${video.id}, Playlist: ${playlist})`);
    this.alertCtrl.create({
      header: 'Remove video',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel', role: 'cancel', handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept', handler: () => {
            this.playlists.removeVideo(playlist.id, video.id)
              .then(() =>
                this.playlists.listVideos(playlist.id)
                  .then((_videos) => {
                    console.log('[PlaylistVideosPage] listvideos');
                    console.log(_videos);
                    this.myVideos = _videos;
                  })
                  .catch((err) => {
                    console.log(err);
                  })
              );
          }
        }
      ]
    }).then((alert) => alert.present());
  }

}
