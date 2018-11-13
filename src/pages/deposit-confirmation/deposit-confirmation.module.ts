import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepositConfirmationPage } from './deposit-confirmation';

@NgModule({
  declarations: [
    DepositConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(DepositConfirmationPage),
  ],
})
export class DepositConfirmationPageModule {}
