import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistEditorPageRoutingModule } from './playlist-editor-routing.module';

import { PlaylistEditorPage } from './playlist-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistEditorPageRoutingModule
  ],
  declarations: [PlaylistEditorPage]
})
export class PlaylistEditorPageModule {}
