import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NsfasApplicationsPage } from './nsfas-applications';

@NgModule({
  declarations: [
    NsfasApplicationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NsfasApplicationsPage),
  ],
})
export class NsfasApplicationsPageModule {}
