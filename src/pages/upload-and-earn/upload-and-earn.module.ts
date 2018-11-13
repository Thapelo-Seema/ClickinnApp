import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadAndEarnPage } from './upload-and-earn';
import { IonicStepperModule } from 'ionic-stepper';
import { ProgressBarModule } from "angular-progress-bar";

@NgModule({
  declarations: [
    UploadAndEarnPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadAndEarnPage), IonicStepperModule, ProgressBarModule
  ],
})
export class UploadAndEarnPageModule {}
