import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttachmentPopupPage } from './attachment-popup';

@NgModule({
  declarations: [
    AttachmentPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(AttachmentPopupPage),
  ],
})
export class AttachmentPopupPageModule {}
