import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadAndEarnPage } from './upload-and-earn';
import { IonicStepperModule } from 'ionic-stepper';

@NgModule({
  declarations: [
    UploadAndEarnPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadAndEarnPage), IonicStepperModule
  ],
})
export class UploadAndEarnPageModule {}
