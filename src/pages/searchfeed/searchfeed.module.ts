import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchfeedPage } from './searchfeed';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchfeedPage
  ],
  imports: [
    IonicPageModule.forChild(SearchfeedPage), PipesModule
  ],
  exports: [
  ]

})
export class SearchfeedPageModule {}
