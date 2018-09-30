import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPropertyPage } from './edit-property';
import { ComponentsModule } from '../../components/components.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    EditPropertyPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPropertyPage), ComponentsModule, IonicImageViewerModule
  ],
})
export class EditPropertyPageModule {}
