import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedApartmentsPage } from './saved-apartments';

@NgModule({
  declarations: [
    SavedApartmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedApartmentsPage),
  ],
})
export class SavedApartmentsPageModule {}
