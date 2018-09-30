import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatThreadPage } from './chat-thread';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChatThreadPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatThreadPage), PipesModule
  ],
})
export class ChatThreadPageModule {}
