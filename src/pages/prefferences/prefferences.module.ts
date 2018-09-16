import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrefferencesPage } from './prefferences';

@NgModule({
  declarations: [
    PrefferencesPage,
  ],
  imports: [
    IonicPageModule.forChild(PrefferencesPage),
  ],
})
export class PrefferencesPageModule {}
