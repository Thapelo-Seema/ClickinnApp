import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgentDashboardPage } from './agent-dashboard';

@NgModule({
  declarations: [
    AgentDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(AgentDashboardPage),
  ],
})
export class AgentDashboardPageModule {}
