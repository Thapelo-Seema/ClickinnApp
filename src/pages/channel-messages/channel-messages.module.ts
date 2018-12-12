import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChannelMessagesPage } from './channel-messages';

@NgModule({
  declarations: [
    ChannelMessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(ChannelMessagesPage),
  ],
})
export class ChannelMessagesPageModule {}
