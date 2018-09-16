import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchfeedPage } from './searchfeed';
import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  declarations: [
    SearchfeedPage, TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(SearchfeedPage),
  ],
  exports: [TimeAgoPipe]
})
export class SearchfeedPageModule {}
