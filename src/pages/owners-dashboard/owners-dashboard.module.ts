import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnersDashboardPage } from './owners-dashboard';

@NgModule({
  declarations: [
    OwnersDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnersDashboardPage),
  ],
})
export class OwnersDashboardPageModule {}
