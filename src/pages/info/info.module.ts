import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoPage } from './info';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    InfoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoPage),
    IonicImageViewerModule
  ],
})
export class InfoPageModule {}
