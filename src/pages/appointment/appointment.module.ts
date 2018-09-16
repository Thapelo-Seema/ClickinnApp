import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentPage } from './appointment';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    AppointmentPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentPage),
    IonicImageViewerModule
  ],
})
export class AppointmentPageModule {}
