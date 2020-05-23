import { Component, OnInit, Input } from '@angular/core';

import { Video } from '../models/video';
import { ModalController, AlertController } from '@ionic/angular';
import { VideosService } from '../services/videos.service';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';



@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.page.html',
  styleUrls: ['./video-editor.page.scss'],
})
export class VideoEditorPage implements OnInit {
  @Input()
  private mode = 'view';
  @Input()
  private video: Video;

  private win: any = window;

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
    };



  constructor(private modalCtrl: ModalController, private alertCtrl:AlertController,
    private videos: VideosService, private camera: Camera ) { }

  ngOnInit() {
    // clone video
    this.video = this.clone(this.video);
  }

  close() {
    console.log('[VideoEditorPage] close()');
    this.modalCtrl.dismiss();
  }
  save() {
    console.log('[VideoEditorPage] save()');
    this.modalCtrl.dismiss(this.video);
  }

  async enterImage() {
    console.log('VideoEditorPage] enterImage()');
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
            console.log('URL ' + data.url + ' entered!!. Update Thumbnail video');
            //this.video.url = data.url;
            this.video.thumbnail ={
              url:data.url,
              width:100,
              height:100
            }
            this.videos.updateVideo(this.video)
                .then(() => console.log(`[VideoEditor] url image update`));
          } //end handler
        }//text acept
        ]
      });
    await prompt.present();
  }
 
  selectImage(){
    console.log('[VideoEditorPage] select in folder');
    ////////////////////////////////////////////////////////
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE      
    };
    this.camera.getPicture(options)
      .then((url) => {
        let url_tmp = 'data:image/jpeg;base64,' + url;//url.replace('content://','file:///');
        url = url_tmp;
        //url = this.win.Ionic.WebView.convertFileSrc('file://' + url);
        console.log(`url select image galeria ${url}`);
        this.video.thumbnail = {
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
      this.video.thumbnail = {
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

  private clone(video: Video): Video {
    return {
      id: video.id,
      type: video.type,
      url: video.url,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      tags: video.tags,
      duration: video.duration,
      date: video.date,
      width: video.width,
      height: video.height
    };
  } //end clone

}
