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
import { AgentsProvider } from '../../providers/agents/agents';
import { Agent } from '../../models/agent.interface';
import { MapsProvider } from '../../providers/maps/maps';

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
  predictionLoading: boolean = false;
  progress: number = 0;
  agent: Agent = {
    uid: '',
    name: '', 
    phoneNumber: '',
    areas: [],
    online : true
  }
  predictions: any[] = [];
  connectionError: boolean = false;
  online: boolean = false;
  areas: any[] = [];

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
    private loadingCtrl: LoadingController,
    private agent_svc: AgentsProvider,
    private map_svc: MapsProvider){
    this.loader.present()
    this.user = this.object_init.initializeUser();
    this.recentDp = this.object_init.initializeFileUpload();
  	this.storage.getUser().then(data =>{
      this.user_svc.getUser(data.uid)
      .pipe(take(1))
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
    this.agent.phoneNumber = this.user.phoneNumber ;
    this.agent.uid = this.user.uid;
    this.agent.name = this.user.firstname + " " + this.user.lastname;
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
        if(this.user.user_type == "agent"){
          this.agent_svc.createNewAgent(this.agent);
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

  deleteNearby(index: number){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CONFIRM DELETE",
      message: 'Are you sure you want to delete this area ?',
      buttons: [
        {
          text: 'Delete',
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
      if(index >= 0 && confirm == true){
        this.user.locations.splice(index, 1);
      }
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
      this.storage.setUser(this.user);
      }).catch(err => {
        this.errHandler.handleError(err);
        ldr.dismiss()
      })
  }

  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictions(event){
    this.predictionLoading = true;
    //If there is an internet connection try to make requests
    if(window.navigator.onLine){
      this.online = true;
      if(event.key === "Backspace" || event.code === "Backspace"){
        setTimeout(()=>{//Set timeout to limit the number of requests made during a deletion
          this.map_svc.getPlacePredictionsSA(event.target.value).then(data =>{
            this.handleSuccess(data);
          })
          .catch(err =>{
            console.log('Error 1')
            this.handleNetworkError();
          })
        }, 3000)
      }else{// When location is being typed
        this.map_svc.getPlacePredictionsSA(event.target.value).then(data =>{
          if(data == null || data == undefined ){
            console.log('Error 2')
            this.handleNetworkError();
          }else{
            this.handleSuccess(data);
          }
        })
        .catch(err => {
          console.log('Error 3')
          this.handleNetworkError();
        })
      }
    }else{ //If there's no connection set online status to false, show message and stop spinner
      this.online = false;
      this.predictionLoading = false;
      this.showToast('You are not connected to the internet...')
    }
  }

  showToast(message){
    let toast = this.toast.create({
      message: message,
      duration: 9000
    })
    toast.present();
  }

  cancelSearch(){
    this.predictions = [];
    this.predictionLoading = false;
  }

  selectPlace(place){
    this.predictionLoading = true;
    this.map_svc.getSelectedPlace(place).then(data => {
      this.user.locations.push(data)
      this.agent.areas.push(data)
      this.predictions = [];
      this.predictionLoading = false;
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.predictionLoading = false;
    })
  }

  handleSuccess(data: any[]){
    this.connectionError = false;
    this.predictions = [];
    this.predictions = data;
    this.predictionLoading = false;
  }

  handleNetworkError(){
    if(this.connectionError == false)
      this.errHandler.handleError({message: 'You are offline...check your internet connection'});
      this.predictionLoading = false;
      this.connectionError = true;
  }

  showWarnig(title: string, message: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(',')[0] + ', ' + input.split(',')[1];
  }

}