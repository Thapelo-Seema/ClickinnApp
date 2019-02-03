import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgentGuidePage } from './agent-guide';
@NgModule({
  declarations: [
    AgentGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(AgentGuidePage), 
  ],
})
export class AgentGuidePageModule {}
