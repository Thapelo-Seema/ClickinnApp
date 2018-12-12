import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportAdminPage } from './support-admin';

@NgModule({
  declarations: [
    SupportAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportAdminPage),
  ],
})
export class SupportAdminPageModule {}
