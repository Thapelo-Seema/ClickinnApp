import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandlordRegistrationPage } from './landlord-registration';

@NgModule({
  declarations: [
    LandlordRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(LandlordRegistrationPage),
  ],
})
export class LandlordRegistrationPageModule {}
