import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLandlordsPage } from './my-landlords';

@NgModule({
  declarations: [
    MyLandlordsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyLandlordsPage),
  ],
})
export class MyLandlordsPageModule {}
