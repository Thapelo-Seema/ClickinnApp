import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditApartmentPage } from './edit-apartment';

@NgModule({
  declarations: [
    EditApartmentPage,
  ],
  imports: [
    IonicPageModule.forChild(EditApartmentPage)
  ],
})
export class EditApartmentPageModule {}
