import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Playlist } from '../models/playlist';
import { MemoryPlaylistsService } from '../services/memory-playlists.service';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlaylistEditorPage } from '../playlist-editor/playlist-editor.page'
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
            //this.playVideo(video);
          }
        },
        {
          text: 'Play',
          icon: 'play',
          handler: () => {
            console.log('Play playlist');
            this.editPlaylist(playlist);
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

}
