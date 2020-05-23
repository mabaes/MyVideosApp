import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { VideosService } from './services/videos.service';
import { MemoryVideosService } from './services/memory-videos.service';

import { Camera } from '@ionic-native/camera/ngx';
import { VideoEditorPageModule } from './video-editor/video-editor.module';
import { VideoPlayerPageModule } from './video-player/video-player.module';

import { HttpClientModule } from '@angular/common/http';

import {YoutubeVideosService} from './services/youtube-videos.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, VideoEditorPageModule, VideoPlayerPageModule,HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: VideosService, useClass: MemoryVideosService}    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
