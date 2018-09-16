import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

/**
 * Generated class for the LeasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lease',
  templateUrl: 'lease.html',
})
export class LeasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File, private fileTransfer: FileTransfer,
  	private document: DocumentViewer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeasePage');
  }

}
