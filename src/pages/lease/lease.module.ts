import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeasePage } from './lease';

@NgModule({
  declarations: [
    LeasePage,
  ],
  imports: [
    IonicPageModule.forChild(LeasePage),
  ],
})
export class LeasePageModule {}
