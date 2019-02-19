import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NsfasPage } from './nsfas';

@NgModule({
  declarations: [
    NsfasPage,
  ],
  imports: [
    IonicPageModule.forChild(NsfasPage),
  ],
})
export class NsfasPageModule {}
