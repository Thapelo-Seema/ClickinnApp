import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ObjectInitProvider } from '../../providers/object-init/object-init';

/**
 * Generated class for the SecurePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-secure',
  templateUrl: 'secure.html',
})
export class SecurePage {
  apartment: Apartment;
  reference: string = '';
  loading: boolean = false;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController,
    private storage: LocalDataProvider, private errHandler: ErrorHandlerProvider, private file: File, private fileTransfer: FileTransfer,
    private document: DocumentViewer, private object_init: ObjectInitProvider){
    this.apartment = this.object_init.initializeApartment();
  }

  ionViewWillLoad(){
    this.storage.getApartment().then(data => this.apartment = data)
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
 }

  generateRef(){
  	this.showAlert();
  	this.reference = 'Thap15643Ckn';
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Reference generated',
      subTitle: 'Your payment reference is generated and expires 2 hours from now',
      buttons: ['OK']
    });
    alert.present();
  }

  comingSoon(){
    let alert = this.alertCtrl.create({
      title: 'Coming Soon!',
      subTitle: 'This feature is still under construction, please use the ATM or Bank deposits to complete payments',
      buttons: ['OK']
    });
    alert.present();
  }

  gotoPayment(paymentMethod: string){
    this.navCtrl.push('PaymentDetailsPage', {payment_method: paymentMethod})
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  openLocalPDF(){
    const options: DocumentViewerOptions ={
      title: 'My Current Lease',
      openWith: {enabled: true},
      print: {enabled: true},
      search: {enabled: true}
    }
    this.document.viewDocument('assets/docs/lease.pdf','application/pdf', options);
  }

  downloadAndOpenPDF(){
    let path = this.file.dataDirectory;
    const options: DocumentViewerOptions ={
      title: 'My Current Lease',
      openWith: {enabled: true},
      print: {enabled: true},
      search: {enabled: true}
    }
    const transfer = this.fileTransfer.create();
    transfer.download('https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/lease.pdf?alt=media&token=9a1ac086-aa34-4841-92fb-3a4208c0afa7', path + 'myClickinnLease.pdf').then(entry =>{
      let url = entry.toURL();
      this.document.viewDocument(url, 'application/pdf', options);
    })

  }

}
