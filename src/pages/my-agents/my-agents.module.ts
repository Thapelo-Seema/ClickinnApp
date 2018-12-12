import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAgentsPage } from './my-agents';

@NgModule({
  declarations: [
    MyAgentsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAgentsPage),
  ],
})
export class MyAgentsPageModule {}
