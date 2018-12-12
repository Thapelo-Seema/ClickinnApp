import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandlordSearchPage } from './landlord-search';

@NgModule({
  declarations: [
    LandlordSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(LandlordSearchPage),
  ],
})
export class LandlordSearchPageModule {}
