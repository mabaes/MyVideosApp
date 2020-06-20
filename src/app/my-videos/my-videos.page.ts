import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Video } from '../models/video';
import { VideosService } from '../services/videos.service';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { VideoEditorPage } from '../video-editor/video-editor.page';
import { OverlayEventDetail } from '@ionic/core';
import { VideoPlayerPage } from '../video-player/video-player.page';
import {PlaylistsSelectorPage} from '../playlists-selector/playlists-selector.page'
import { RESTVideosService } from '../services/restvideos.service';

@Component({
  selector: 'app-my-videos',
  templateUrl: './my-videos.page.html',
  styleUrls: ['./my-videos.page.scss'],
})
export class MyVideosPage implements OnInit {
  private query = '';
  public myVideos: Video[] = [];
  private win: any = window;

  constructor(
    //rivate RESTvideos: RESTVideosService,
    private modalCtrl: ModalController, private camera: Camera,
    private alertCtrl: AlertController, private videos: RESTVideosService,
    private actionSheetCtrl: ActionSheetController, private changes: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('ngOnInit MyVideosPage');
    this.searchVideos();
  }

  searchVideos(evt?) {
    console.log('[MyVideosPage] searchVideos()');
    let query = evt ? evt.target.value.trim() : this.query;
    /*
    this.RESTvideos.findVideos(query)
    .then((videos) => {
      this.myVideos = videos
      console.log('[MyVideosPage] RESTsearchVideos() => ' +
        JSON.stringify(this.myVideos));
      this.changes.detectChanges();
    });
    */
    
    this.videos.findVideos(query)
      .then((videos) => {
        this.myVideos = videos
        console.log('[MyVideosPage] searchVideos() => ' +
          JSON.stringify(this.myVideos));
        this.changes.detectChanges();
      });
    

  }

  async enterVideo() {
    console.log('[MyVideosPage] enterVideo()');
    let prompt = await this.alertCtrl.create(
      {
        header: 'Select video',
        message: 'Enter video URL',
        inputs: [{ name: 'url', placeholder: 'URL' }],
        buttons: [{
          text: 'Cancel', role: 'cancel', handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept',
          handler: (data) => {
            console.log('URL ' + data.url + ' entered!!');
            this.addVideo(data.url);
          }
        }
        ]
      });
    await prompt.present();
  }

  selectVideo() {
    console.log('[MyVideosPage] selectVideo()');
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO
    };
    this.camera.getPicture(options)
      .then((url) => {
        console.log(`url select video ${url}`);
        //this.addVideo('file://' + url);
        this.addVideo(this.win.Ionic.WebView.convertFileSrc('file://' + url));
      })
      .catch((err) => {
        // Handle error
        this.alertCtrl.create({
          header: 'Error',
          message: 'ERROR selecting video: ' + JSON.stringify(err),
          buttons: ['OK']
        }).then((alert) => alert.present());
      });
  } //end select video

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

  readVideoInfo(url: string, secs?: number): Promise<Video> {
    console.log(`readVideoInfo(${url},${secs})`);
    //let url_tmp = url.replace('file:///','http://localhost:8100/');
    //url = url_tmp;
    return new Promise((resolve, reject) => {
      let video: Video = {
        type: 'local',
        url: url,
        title: '',
        description: '',
        date: new Date().toDateString()
      };
      let videoNode: HTMLVideoElement = document.createElement('video');
      videoNode.onloadedmetadata = () => {
        // - get basic info
        video.width = videoNode.videoWidth;
        video.height = videoNode.videoHeight;
        video.duration = String(videoNode.duration) + ' secs';
        // - move to frame
        videoNode.currentTime = secs ? Math.min(secs, videoNode.duration) : 0;
      };
      videoNode.onseeked = (ev) => {
        // - capture thumbnail
        try {
          let canvas = document.createElement('canvas');
          canvas.height = videoNode.videoHeight;
          canvas.width = videoNode.videoWidth;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(videoNode, 0, 0, canvas.width, canvas.height);          
          video.thumbnail = {
            url: canvas.toDataURL(),
            height: canvas.height,
            width: canvas.width
          };
          
        } catch (err) {
          console.log('videoNode.onseeked_error=' + JSON.stringify(err));
        } finally {
          resolve(video);
        }
      };
      videoNode.onerror = (ev) => {
        let error = {
          code: videoNode.error.code, message:
            videoNode.error.message
        };
        reject(error);
      };
      console.log(`url cambiada: ${url}`);
      videoNode.src = url;      
    });
  }//end read

  showMenu(video) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Add to playlist: ' + video.title,
          icon: 'star',
          handler: () => {
            console.log('Add play list');
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
          text: 'Edit',
          icon: 'create',
          handler: () => {
            console.log('Edit video!!');
            this.editVideo(video);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            console.log('Delete video!!');
            this.deleteVideo(video);
          }

        }, // delete

      ]
    }).then((actionSheet) => actionSheet.present());
  } //showmenu

  addPlaylist(video:Video){
    console.log(`[MyVideosPage] addPlaylist(${video.id})`);
    this.modalCtrl.create({
      component: PlaylistsSelectorPage,
      //componentProps: { idVideo: video.id }
      componentProps: { video: video }
    })
    .then((modal) => {
      modal.onDidDismiss()
        .then((evt: OverlayEventDetail) => {
          
          /*if (evt && evt.data) {
            this.videos.updateVideo(evt.data)
              .then(() => this.searchVideos());
          } */
        });
      modal.present();
    });
  }

  editVideo(video: Video) {
    console.log(`[MyVideosPage] editVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoEditorPage,
      componentProps: { mode: 'edit', video: video }
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

  playVideo(video: Video) {
    console.log(`[MyVideosPage] playVideo(${video.id})`);
    this.modalCtrl.create({
      component: VideoPlayerPage,
      componentProps: { video: video }
    }).then((modal) => modal.present());
  }

  deleteVideo(video: Video) {
    console.log(`[MyVideosPage] deleteVideo(${video.id})`);
    this.alertCtrl.create({
      header: 'Delete video',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel', role: 'cancel', handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept', handler: () => {
            this.videos.removeVideo(video.id)
              .then(() => this.searchVideos());
          }
        }
      ]
    }).then((alert) => alert.present());
  }
} //end class


