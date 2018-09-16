import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeekingPage } from './seeking';
import { ComponentsModule } from  '../../components/components.module';

@NgModule({
  declarations: [
    SeekingPage,
  ],
  imports: [
    IonicPageModule.forChild(SeekingPage), ComponentsModule
  ],
})
export class SeekingPageModule {}
