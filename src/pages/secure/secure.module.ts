import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecurePage } from './secure';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    SecurePage,
  ],
  imports: [
    IonicPageModule.forChild(SecurePage),
    IonicImageViewerModule
  ],
})
export class SecurePageModule {}
