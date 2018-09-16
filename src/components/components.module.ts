import { NgModule } from '@angular/core';
import { ClickinnMapsComponent } from './clickinn-maps/clickinn-maps';
import { FormsModule } from '@angular/forms';
import { AccommodationsComponent } from './accommodations/accommodations';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { UploadAndEarnComponent } from './upload-and-earn/upload-and-earn';

@NgModule({
	declarations: [ClickinnMapsComponent,
    AccommodationsComponent,
    UploadAndEarnComponent],
	imports: [FormsModule, IonicModule, CommonModule],
	exports: [ClickinnMapsComponent,
    AccommodationsComponent,
    UploadAndEarnComponent]
})
export class ComponentsModule {}
