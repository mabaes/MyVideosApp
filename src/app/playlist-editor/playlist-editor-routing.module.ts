import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaylistEditorPage } from './playlist-editor.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistEditorPageRoutingModule {}
