import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchfeedPage } from './searchfeed';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    SearchfeedPage
  ],
  imports: [
    IonicPageModule.forChild(SearchfeedPage), PipesModule, DirectivesModule
  ],
  exports: [
  ]

})
export class SearchfeedPageModule {}
