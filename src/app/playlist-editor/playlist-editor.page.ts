import { Component, OnInit, Input } from '@angular/core';

import { Playlist } from '../models/playlist';
import { ModalController, AlertController } from '@ionic/angular';
import {MemoryPlaylistsService} from '../services/memory-playlists.service';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.page.html',
  styleUrls: ['./playlist-editor.page.scss'],
})
export class PlaylistEditorPage implements OnInit {
  @Input()
  private mode = 'view';
  @Input()
  private playlist: Playlist;

  private win: any = window;

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
    };

    constructor(private modalCtrl: ModalController, private alertCtrl:AlertController,
      private playlists: MemoryPlaylistsService, private camera: Camera ) { }
  
    ngOnInit() {
      console.log('Modo:'+ this.mode);
      if (this.mode!='add') {
        this.playlist = this.clone(this.playlist);
      }
    }
  
    close() {
      console.log('[PlaylistsEditorPage] close()');
      this.modalCtrl.dismiss();
    }
    save() {
      console.log('[PlaylistsEditorPage] save()');
      this.modalCtrl.dismiss(this.playlist);
    }


    async enterImage() {
      console.log('PlaylistsEditorPage] enterImage()');
      let prompt = await this.alertCtrl.create(
        {
          header: 'Select image',
          message: 'Enter thumbnail URL',
          inputs: [{ name: 'url', placeholder: 'URL' }],
          buttons: [{
            text: 'Cancel', role: 'cancel', handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Accept',
            handler: (data) => {
              console.log('URL ' + data.url + ' entered!!. Update Thumbnail playlist');
              //this.video.url = data.url;
              this.playlist.thumbnail ={
                url:data.url,
                width:100,
                height:100
              }
              this.playlists.updatePlaylist(this.playlist)
                  .then(() => console.log(`[PlaylistsEditor] url image update`));
            } //end handler
          }//text acept
          ]
        });
      await prompt.present();
    }
   
    selectImage(){
      console.log('PlaylistsEditorPage] select in folder');
      ////////////////////////////////////////////////////////
      const options: CameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE      
      };
      this.camera.getPicture(options)
        .then((url) => {
          let url_tmp = 'data:image/jpeg;base64,' + url;
          url = url_tmp;
          //url = this.win.Ionic.WebView.convertFileSrc('file://' + url);
          console.log(`url select image galeria ${url}`);
          this.playlist.thumbnail = {
            url: url,
            width: 100,
            height: 100
          }
          //this.addVideo('file://' + url);
        })
        .catch((err) => {
          // Handle error
          this.alertCtrl.create({
            header: 'Error',
            message: 'ERROR selecting image galeria: ' + JSON.stringify(err),
            buttons: ['OK']
          }).then((alert) => alert.present());
        });
      ///////////////////////////////////////////////////////
    } //end select
  
    cameraImage() {
      console.log('[VideoEditor] cameraImage()');
      this.camera.getPicture(this.options).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.playlist.thumbnail = {
          url: base64Image,
          width: 100,
          height: 100
        }
      }, (err) => {
        // Handle error
        console.log(`Error Imagen desde Camera ${err}`);
      }
      );
    }
  





    private clone(playlist: Playlist): Playlist {
      return {
        id: playlist.id,   
        title: playlist.title,
        description: playlist.description,
        thumbnail: playlist.thumbnail,
        date: playlist.date,
        count:playlist.count
      };
    } //end clone

}
