import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandlordDashboardPage } from './landlord-dashboard';

@NgModule({
  declarations: [
    LandlordDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(LandlordDashboardPage),
  ],
})
export class LandlordDashboardPageModule {}
