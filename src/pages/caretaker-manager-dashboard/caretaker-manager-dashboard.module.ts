import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaretakerManagerDashboardPage } from './caretaker-manager-dashboard';

@NgModule({
  declarations: [
    CaretakerManagerDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(CaretakerManagerDashboardPage),
  ],
})
export class CaretakerManagerDashboardPageModule {}
