import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistsSelectorPageRoutingModule } from './playlists-selector-routing.module';

import { PlaylistsSelectorPage } from './playlists-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistsSelectorPageRoutingModule
  ],
  declarations: [PlaylistsSelectorPage]
})
export class PlaylistsSelectorPageModule {}
