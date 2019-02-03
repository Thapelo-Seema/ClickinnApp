import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacementsPage } from './placements';

@NgModule({
  declarations: [
    PlacementsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacementsPage),
  ],
})
export class PlacementsPageModule {}
