import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Video } from '../models/video';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import {MemoryPlaylistsService} from '../services/memory-playlists.service';


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

  constructor(private modalCtrl: ModalController, private alertCtrl:AlertController,
    private playlists: MemoryPlaylistsService, private actionSheetCtrl: ActionSheetController,
    private changes: ChangeDetectorRef) { }

  ngOnInit() {
    console.log (`[PlaylistVideosPage ${this.playlist.id}]`);
    ///////////////
    this.playlists.listVideos(this.playlist.id)
    .then((_videos) => {
      console.log('[PlaylistVideosPage] listvideos');
      console.log(_videos);
      this.myVideos = _videos;
    })
    .catch((err) => {
      console.log(err);
    })

    
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
            //this.playVideo(video);
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
            //this.deleteVideo(video);
          }

        }, // delete

      ]
    }).then((actionSheet) => actionSheet.present());
  } //showmenu


  editVideo(video: Video) {
    console.log(`[PlaylistVideosPage] editVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoEditorPage,
      componentProps: { mode: 'view', video: video }
    })
      .then((modal) => {
        modal.onDidDismiss()
          .then((evt: OverlayEventDetail) => {
            /*
            if (evt && evt.data) {
              this.videos.updateVideo(evt.data)
                .then(() => this.searchVideos());
            }
            */
          });
        modal.present();
      });
  }//edit video

}
