import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatThreadPage } from './chat-thread';
import { SearchfeedPageModule } from '../searchfeed/searchfeed.module';

@NgModule({
  declarations: [
    ChatThreadPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatThreadPage), SearchfeedPageModule
  ],
})
export class ChatThreadPageModule {}
