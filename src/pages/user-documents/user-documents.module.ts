import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDocumentsPage } from './user-documents';

@NgModule({
  declarations: [
    UserDocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDocumentsPage),
  ],
})
export class UserDocumentsPageModule {}
