import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage'
import { FileUpload } from '../../models/file-upload.interface';
import { Image } from '../../models/image.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
/**
 * Generated class for the EditBankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-banking',
  templateUrl: 'edit-banking.html',
})
export class EditBankingPage {
  user: User;
  loader = this.loadingCtrl.create();
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private storage: LocalDataProvider,
  	private toast: ToastController, 
    private afs: AngularFirestore, 
    private errHandler: ErrorHandlerProvider,
    private camera: Camera, 
    private afstorage: AngularFireStorage, 
    private object_init: ObjectInitProvider,
    private user_svc: UserSvcProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  	this.loader.present()
    this.user = this.object_init.initializeUser();
  	this.storage.getUser().then(data =>{
      this.user_svc.getUser(data.uid)
      .pipe(
        take(1)
      )
      .subscribe(user =>{
        this.user = this.object_init.initializeUser2(user);
        this.loader.dismiss()
      })	
	  }).catch(err => {
      this.errHandler.handleError(err);
      this.loader.dismiss()
    })
  }

  ionViewWillLoad(){
  }

  save(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm changes",
      message: "Are you sure you want to save the changes to your profile ?",
      buttons: [
        {
          text: 'Confirm',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'Cancel',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(confirm){
          this.persistChanges();
        }
    })
    
  }
  
  persistChanges(){
    let ldr = this.loadingCtrl.create()
    ldr.present();
    this.storage.setUser(this.user)
    .then(() =>{
        this.afs.collection('Users').doc(this.user.uid).update(this.user).then(() =>{
        ldr.dismiss()
        this.toast.create({
          message: "Profile successfully updated",
          showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle',
            cssClass: 'toast_margins full_width'
      }).present().then(() =>{
        
      })
        
      }).catch(err => {
        this.errHandler.handleError(err);
        ldr.dismiss()
      })
    })
    .catch(err =>{
      ldr.dismiss()
      this.errHandler.handleError(err)
    })
    
  }

}
