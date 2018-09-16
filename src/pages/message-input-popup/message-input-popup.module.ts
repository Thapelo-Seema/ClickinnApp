import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageInputPopupPage } from './message-input-popup';

@NgModule({
  declarations: [
    MessageInputPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageInputPopupPage),
  ],
})
export class MessageInputPopupPageModule {}
