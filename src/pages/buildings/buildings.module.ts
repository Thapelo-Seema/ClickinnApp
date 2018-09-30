import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingsPage } from './buildings';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    BuildingsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingsPage), IonicImageViewerModule
  ],
})
export class BuildingsPageModule {}
