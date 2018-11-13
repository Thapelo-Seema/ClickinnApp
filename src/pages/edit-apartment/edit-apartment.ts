import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Apartment } from '../../models/properties/apartment.interface';
import { Image } from '../../models/image.interface';
import { FileUpload } from '../../models/file-upload.interface';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { FileUploadSvcProvider } from '../../providers/file-upload-svc/file-upload-svc';

/**
 * Generated class for the EditApartmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-apartment',
  templateUrl: 'edit-apartment.html',
})
export class EditApartmentPage {
  apartment: Apartment;
  loading: boolean = true;
  images: Image[] = [];
  fileUpload: FileUpload;
  apartImgCount: number = 0;
  apartmentImagesAdded: boolean = false;
  imagesLoaded: boolean[] = 
      [false, false, false, false, false, false, false, false, false, false,
       false, false, false, false, false, false, false, false, false, false, 
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false
       ];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private local_db: LocalDataProvider,
  	private accom_svc: AccommodationsProvider,
  	private object_init: ObjectInitProvider,
  	private toastCtrl: ToastController,
  	private camera: Camera,
  	private errHandler: ErrorHandlerProvider,
  	private file_upload_svc: FileUploadSvcProvider,
    private alertCtrl: AlertController
    ) {
  	this.cancelPic()

  	this.apartment = this.object_init.initializeApartment();
  	this.local_db.getApartment()
  	.then(apart =>{
  		if(apart){
  			console.log('apartment: ', apart )
  			this.apartment = apart;
  			this.loading  = false;
  			if(!(apart.images.length > 0)){
  				console.log('apart images: ', apart.images)
  				this.images = Object.keys(apart.images).map(imageId =>{
              this.imagesLoaded.push(false);
			      	return apart.images[imageId]
			    })
			    this.apartImgCount = this.images.length;
  			}else{
          
  				console.log('apart images: ', apart.images)
  				this.images = apart.images;
  				this.apartImgCount = apart.images.length;
  			}
  			
  		}else{
  			this.loading = false;
  			console.log('no apartment...')
  		}
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditApartmentPage');
  }

  remove(index: number){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm picture deletion",
      message: "Are you sure you want to delete this picture ?",
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
      if(index >= 0 && confirm){
        this.images.splice(index, 1);
      }
    })
  }

  save(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm intention",
      message: "Are you sure you want to save the changes ?",
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
        this.loading = true;
        this.apartment.images = this.images;
        this.accom_svc.updateApartment(this.apartment)
        .then(() =>{
          this.loading = false;
          this.toastCtrl.create({
            message: 'The apartment was successfully updated !',
            duration: 5000
          })
          .present()
        })
        .catch(err =>{
          console.log(err);
        })
      }
    })
  }

  uploadApartmentImage(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm picture upload",
      message: "Are sure you want to add this image to the apartment profile ?",
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
        this.loading = true;
        this.file_upload_svc.uploadPic(this.fileUpload)
        .then(imag =>{
          this.images.push(imag);
          this.loading = false;
          this.toastCtrl.create({
            message: 'Picture added !',
            duration: 3000
          })
          .present()
        })
      }
    })
  }

  cancelPic(){
  	this.fileUpload = {
  		file: null,
  		name: '',
  		path: '',
  		progress: 0,
  		url: ''
  	}
  }

  addPicture(){
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 1,
      allowEdit: true,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.apartImgCount++;
     this.apartmentImagesAdded = true;
     this.fileUpload ={
       file: 'data:image/jpeg;base64,' + imageData,
       path: 'ApartmentImages',
       url: '',
       name: `${this.apartment.apart_id}_${this.apartImgCount}.jpg`,
       progress: 0
     };
    })
    .then(() =>{
    	this.uploadApartmentImage();
    })
    .catch(err => {
      this.errHandler.handleError({errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected'});
      this.loading = false;
    })
  }

}
