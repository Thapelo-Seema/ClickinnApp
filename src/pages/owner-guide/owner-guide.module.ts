import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnerGuidePage } from './owner-guide';
@NgModule({
  declarations: [
    OwnerGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerGuidePage), 
  ],
})
export class OwnerGuidePageModule {}
