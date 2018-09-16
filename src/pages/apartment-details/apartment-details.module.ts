import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApartmentDetailsPage } from './apartment-details';
import { ComponentsModule } from  '../../components/components.module';

@NgModule({
  declarations: [
    ApartmentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ApartmentDetailsPage), ComponentsModule
  ],
  exports: [
  	ApartmentDetailsPage
  ]
})
export class ApartmentDetailsPageModule {}
