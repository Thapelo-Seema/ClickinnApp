import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepositsPage } from './deposits';

@NgModule({
  declarations: [
    DepositsPage,
  ],
  imports: [
    IonicPageModule.forChild(DepositsPage),
  ],
})
export class DepositsPageModule {}
