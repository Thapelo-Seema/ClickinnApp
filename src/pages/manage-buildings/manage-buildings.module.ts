import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageBuildingsPage } from './manage-buildings';

@NgModule({
  declarations: [
    ManageBuildingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageBuildingsPage),
  ],
})
export class ManageBuildingsPageModule {}
