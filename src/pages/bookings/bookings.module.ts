import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingsPage } from './bookings';
import { IonicImageViewerModule } from 'ionic-img-viewer';
//import { DirectivesModule } from '../../directives/directives.module';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
  declarations: [
    BookingsPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingsPage), IonicImageViewerModule, TooltipsModule 
  ],
})
export class BookingsPageModule {}
