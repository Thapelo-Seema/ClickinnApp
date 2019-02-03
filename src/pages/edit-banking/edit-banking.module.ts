import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBankingPage } from './edit-banking';

@NgModule({
  declarations: [
    EditBankingPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBankingPage),
  ],
})
export class EditBankingPageModule {}
