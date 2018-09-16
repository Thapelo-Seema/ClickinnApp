import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BursaryPlacementsPage } from './bursary-placements';

@NgModule({
  declarations: [
    BursaryPlacementsPage,
  ],
  imports: [
    IonicPageModule.forChild(BursaryPlacementsPage),
  ],
})
export class BursaryPlacementsPageModule {}
