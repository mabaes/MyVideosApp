import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Playlist } from '../models/playlist';
import { MemoryPlaylistsService } from '../services/memory-playlists.service';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlaylistEditorPage } from '../playlist-editor/playlist-editor.page'
import { OverlayEventDetail } from '@ionic/core';
import { Video } from '../models/video';

@Component({
  selector: 'app-playlists-selector',
  templateUrl: './playlists-selector.page.html',
  styleUrls: ['./playlists-selector.page.scss'],
})
export class PlaylistsSelectorPage implements OnInit {
  @Input()
  //private idVideo: string;
  private video : Video;

  public myPlaylists: Playlist[] = [];
  constructor(
    private playlist: MemoryPlaylistsService,
    private changes: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    //console.log(`Playlist Selector idvideo: ${this.idVideo}`)
    console.log(`Playlist Selector idvideo: ${this.video}`);
    console.log(this.video);
    this.playlist.findPlaylists()
      .then((playlists) => {
        this.myPlaylists = playlists;
        console.log('[PlaylistsPage] findplaylists() => ' +
          JSON.stringify(this.myPlaylists));
        this.changes.detectChanges();
      })
  }

  close() {
    console.log('[PlaylistsSelectorPage] close()');
    this.modalCtrl.dismiss();
  }

  addVideoToPlaylist(playlist: Playlist) {  
    console.log(`Add to playlist ${playlist.id}`);
    console.log(`Add video ${this.video.id}`);
    console.log(this.video);
    this.playlist.addVideo(playlist.id, this.video)
    .then(() => {
      // Handle error
      this.alertCtrl.create({
        header: 'SUCCESS',
        message: 'Video added successfully',
        buttons: [
          {text: 'OK', handler:() => {this.modalCtrl.dismiss(this.playlist)}}
        ]
      }).then((alert) =>  alert.present());      
    })
      .catch((err) => {
        // Handle error
        this.alertCtrl.create({
          header: 'Warning',
          message:  err,
          buttons: [
            {text: 'OK', handler:() => {this.modalCtrl.dismiss(this.playlist)}}
          ]
        }).then((alert) => alert.present());
      });

  }


}
