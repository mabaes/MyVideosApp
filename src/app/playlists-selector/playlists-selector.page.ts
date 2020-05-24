import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Playlist } from '../models/playlist';
import { MemoryPlaylistsService } from '../services/memory-playlists.service';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlaylistEditorPage } from '../playlist-editor/playlist-editor.page'
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-playlists-selector',
  templateUrl: './playlists-selector.page.html',
  styleUrls: ['./playlists-selector.page.scss'],
})
export class PlaylistsSelectorPage implements OnInit {
  @Input()
  private idVideo: string;

  public myPlaylists: Playlist[] = [];
  constructor(
    private playlist: MemoryPlaylistsService,
    private changes: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    console.log(`Playlist Selector idvideo: ${this.idVideo}`)
    this.playlist.findPlaylists()
      .then((playlists) => {
        this.myPlaylists = playlists;
        console.log('[PlaylistsPage] findplaylists() => ' +
          JSON.stringify(this.myPlaylists));
        this.changes.detectChanges();
      })
  }

  addVideoToPlaylist(playlist: Playlist) {  
    console.log(`Add to playlist ${playlist.id}`);
    console.log(`Add video ${this.idVideo}`);

  }


}
