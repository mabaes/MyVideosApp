import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Playlist } from '../models/playlist';
import { MemoryPlaylistsService } from '../services/memory-playlists.service';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlaylistEditorPage } from '../playlist-editor/playlist-editor.page'
import { PlaylistVideosPage } from '../playlist-videos/playlist-videos.page'
import {PlaylistPlayerPage} from '../playlist-player/playlist-player.page'
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.page.html',
  styleUrls: ['./playlists.page.scss'],
})
export class PlaylistsPage implements OnInit {
  public myPlaylists: Playlist[] = [];
  constructor(private playlist: MemoryPlaylistsService,
    private changes: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.playlist.findPlaylists()
      .then((playlists) => {
        this.myPlaylists = playlists;
        console.log('[PlaylistsPage] findplaylists() => ' +
          JSON.stringify(this.myPlaylists));
        this.changes.detectChanges();
      })
  }

  showPlaylist() {
    this.playlist.findPlaylists()
      .then((playlists) => {
        this.myPlaylists = playlists;
        console.log('[PlaylistsPage] findplaylists() => ' +
          JSON.stringify(this.myPlaylists));
        this.changes.detectChanges();
      })

  }

  
  showMenu(playlist) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Open',
          icon: 'folder',
          handler: () => {
            console.log('Play playlist');
            this.openPlaylist(playlist);
          }
        },
        {
          text: 'Play',
          icon: 'play',
          handler: () => {
            console.log('Play playlist');
            this.playPlaylist(playlist);
          }
        },
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            console.log('Edit playlist!!');
            this.editPlaylist(playlist);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            console.log('Delete playlist!!');
            this.deletePlaylist(playlist);
          }

        }, // delete

      ]
    }).then((actionSheet) => actionSheet.present());
  } //showmenu


playPlaylist (playlist: Playlist) {
  this.modalCtrl.create({
    component: PlaylistPlayerPage,
    componentProps: { playlist: playlist }
  }).then((modal) => modal.present());
}

  openPlaylist(playlist: Playlist) {
    this.modalCtrl.create({
      component: PlaylistVideosPage,   
      componentProps: { playlist: playlist }  
    })
      .then((modal) => {
        modal.onDidDismiss()
          .then((evt: OverlayEventDetail) => {
            if (evt && evt.data) {
              this.playlist.updatePlaylist(evt.data)
                .then(() => this.showPlaylist());
            }
          });
        modal.present();
      });

  }
  deletePlaylist(playlist: Playlist) {
    console.log(`[PlaylistPage] deletePlaylist(${playlist.id})`);
    this.alertCtrl.create({
      header: 'Delete Playlist',
      message: 'Are you sure to delete ? ' +playlist.title,
      buttons: [
        {
          text: 'Cancel', role: 'cancel', handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept', handler: () => {
            
            this.playlist.removePlaylist(playlist.id)
              .then(() => this.showPlaylist());
            
          }
        }
      ]
    }).then((alert) => alert.present());
  }

  editPlaylist(playlist: Playlist) {
    console.log(`[PlaylistPage] editPlaylist(${playlist.id})`);
    this.modalCtrl.create({
      component: PlaylistEditorPage,
      componentProps: { mode: 'edit', playlist: playlist }
    })
      .then((modal) => {
        modal.onDidDismiss()
          .then((evt: OverlayEventDetail) => {
            if (evt && evt.data) {
              this.playlist.updatePlaylist(evt.data)
                .then(() => this.showPlaylist());
            }
          });
        modal.present();
      });
  }//edit playlist

  addPlaylistX() {
    console.log(`[PlaylistPage] add new playlist`);
    this.modalCtrl.create({
      component: PlaylistEditorPage,
      componentProps: { mode: 'add',  }
    })
      .then((modal) => {
        modal.onDidDismiss()
          .then((evt: OverlayEventDetail) => {
            if (evt && evt.data) {
              this.playlist.updatePlaylist(evt.data)
                .then(() => this.showPlaylist());
            }
          });
        modal.present();
      });
  }

  addPlaylist(){
    console.log(`[PlaylistPage] add new playlist`);
    this.createPlaylistEmpty()
      .then((playlist) => {
        console.log(`created temp play list ${playlist}`)
        this.modalCtrl.create({
          component: PlaylistEditorPage,
          componentProps: { mode: 'add', playlist: playlist }
        }).then((modal) => {
          modal.onDidDismiss()
            .then((evt: OverlayEventDetail) => {
              if (evt && evt.data) {
                this.playlist.addPlaylist(evt.data)                
                  .then(() => this.showPlaylist());
              }
            });
          modal.present();
        });
      })
      .catch((err) => {
        // Handle error
        this.alertCtrl.create({
          header: 'Error',
          message: 'ERROR creating playlist : ' + JSON.stringify(err),
          buttons: ['OK']
        }).then((alert) => alert.present());
      });
  }
  /*
   addVideo(url: string) {
    console.log(`[MyVideosPage] addVideo(${url})`);
    this.readVideoInfo(url)
      .then((video) => {
        console.log(`XXreadvideoinfo ${video}`)
        this.modalCtrl.create({
          component: VideoEditorPage,
          componentProps: { mode: 'add', video: video }
        }).then((modal) => {
          modal.onDidDismiss()
            .then((evt: OverlayEventDetail) => {
              if (evt && evt.data) {
                this.videos.addVideo(evt.data)
                  .then(() => this.searchVideos());
              }
            });
          modal.present();
        });
      })
      .catch((err) => {
        // Handle error
        this.alertCtrl.create({
          header: 'Error',
          message: 'ERROR reading video info: ' + JSON.stringify(err),
          buttons: ['OK']
        }).then((alert) => alert.present());
      });
  } //end add video
  */

  createPlaylistEmpty(): Promise<Playlist> {
    console.log('New play list empty');
    return new Promise((resolve, reject) => {
      let _playlist: Playlist = {
        id:'',
        title:'',
        description:'',
        count:0
      } 
      resolve(_playlist);
    });

  }
  


  /**
    addVideo(url: string) {
    console.log(`[MyVideosPage] addVideo(${url})`);
    this.readVideoInfo(url)
      .then((video) => {
        console.log(`XXreadvideoinfo ${video}`)
        this.modalCtrl.create({
          component: VideoEditorPage,
          componentProps: { mode: 'add', video: video }
        }).then((modal) => {
          modal.onDidDismiss()
            .then((evt: OverlayEventDetail) => {
              if (evt && evt.data) {
                this.videos.addVideo(evt.data)
                  .then(() => this.searchVideos());
              }
            });
          modal.present();
        });
      })
      .catch((err) => {
        // Handle error
        this.alertCtrl.create({
          header: 'Error',
          message: 'ERROR reading video info: ' + JSON.stringify(err),
          buttons: ['OK']
        }).then((alert) => alert.present());
      });
  } //end add video 
   */

}
