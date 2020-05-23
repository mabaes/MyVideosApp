import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../models/video';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.page.html',
  styleUrls: ['./video-player.page.scss'],
})
export class VideoPlayerPage implements OnInit {
  @Input()
  private video: Video;
  constructor(private modalCtrl: ModalController, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(`Video a reproducir: ${this.video.type}`);
    //this.video.url;
  }

  close() {
    console.log('[VideoEditorPage] close()');
    this.modalCtrl.dismiss();
  }

}
