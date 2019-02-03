import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  user: User;
  image: any = "assets/imgs/placeholder.png";
  loader = this.loadingCtrl.create({dismissOnPageChange: true});
  dpChanged: boolean = false;
  recentDp: FileUpload;
  imageLoaded: boolean = false;
  progress: number = 0;

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
    private loadingCtrl: LoadingController){
    this.loader.present()
    this.user = this.object_init.initializeUser();
    this.recentDp = this.object_init.initializeFileUpload();
    
  	this.storage.getUser().then(data =>{
      this.user_svc.getUser(data.uid)
      .pipe(
        take(1)
      )
      .subscribe(user =>{
        this.user = this.object_init.initializeUser2(user);
        if(user.photoURL !== '' || user.photoURL == undefined) this.image = user.photoURL;
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
        if(!this.dpChanged){
          this.persistChanges();
        }else{
          this.uploadDp()
          .then(image =>{
            this.user.photoURL = image.url;
            this.persistChanges();
          })
          .catch(err => {
              this.errHandler.handleError({message: 'Please check your internet connection...picture not uploaded'});
          })
        }
      }
    })
    
  }
  //Select or take a picture from the galley
  changeDp(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 2,
      allowEdit: true,
      targetWidth: 800,
      targetHeight: 800
    }
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.image = 'data:image/jpeg;base64,' + imageData;
     this.recentDp.file = this.image;
     this.user.photoURL = this.image;
     this.dpChanged = true;
    }).catch(err => {
      this.errHandler.handleError({errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected'});
    })
  }

  uploadDp(): Promise<Image>{
    const storageRef =   this.afstorage.ref(`UserDisplayImages/${this.user.uid}`);
     const uploadTask = storageRef.putString(this.recentDp.file, 'data_url');
     return new Promise<Image>((resolve, reject) => {
      let subs = uploadTask.snapshotChanges().subscribe(
        (snapshot) =>{
          //update the progress property of the upload object
          uploadTask.percentageChanges().subscribe(progress =>{
            this.recentDp.progress = progress;
            this.progress = progress;
            console.log('progress... ', this.recentDp.progress);
          })
        },
        (err) =>{
          //if there's an error log it in the console
          reject(err.message)
        },
        () =>{
          let tempUrl = '';
          //on success of the upload, update the url property of the upload object
          let subs2 = storageRef.getDownloadURL().subscribe(down_url =>{
            tempUrl = down_url;
            }, 
            err =>{
              reject(err.message)
            },
            () =>{
              let image: Image = {
                url: tempUrl,
                name: this.recentDp.name,
                progress: this.recentDp.progress,
                path: this.recentDp.path
              }
              this.user.photoURL = image.url;
              subs.unsubscribe();
              subs2.unsubscribe();
              resolve(image)
            }
          ) 
        }
      )
    })
  }

  persistChanges(){
    let ldr = this.loadingCtrl.create()
    ldr.present();
    this.afs.collection('Users').doc(this.user.uid).update(this.user).then(() =>{
        this.toast.create({
          message: "Profile successfully updated",
          showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle',
            cssClass: 'toast_margins full_width'
      }).present().then(() =>{
          ldr.dismiss()
      })
        
      }).catch(err => {
        this.errHandler.handleError(err);
        ldr.dismiss()
      })
  }

}