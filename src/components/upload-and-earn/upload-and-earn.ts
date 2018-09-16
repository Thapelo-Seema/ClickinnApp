import { Component } from '@angular/core';

/**
 * Generated class for the UploadAndEarnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'upload-and-earn',
  templateUrl: 'upload-and-earn.html'
})
export class UploadAndEarnComponent {

  text: string;

  constructor() {
    console.log('Hello UploadAndEarnComponent Component');
    this.text = 'Hello World';
  }

}
