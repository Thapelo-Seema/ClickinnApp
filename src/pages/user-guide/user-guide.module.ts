import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserGuidePage } from './user-guide';
@NgModule({
  declarations: [
    UserGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(UserGuidePage), 
  ],
})
export class UserGuidePageModule {}
