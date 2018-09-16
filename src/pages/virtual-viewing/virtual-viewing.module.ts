import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VirtualViewingPage } from './virtual-viewing';

@NgModule({
  declarations: [
    VirtualViewingPage,
  ],
  imports: [
    IonicPageModule.forChild(VirtualViewingPage),
  ],
})
export class VirtualViewingPageModule {}
