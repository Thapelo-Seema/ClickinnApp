import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Apartment } from '../../models/properties/apartment.interface';
import { Image } from '../../models/image.interface';
import { FileUpload } from '../../models/file-upload.interface';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { FileUploadSvcProvider } from '../../providers/file-upload-svc/file-upload-svc';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { take } from 'rxjs-compat/operators/take';
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
  loader = this.loadingCtrl.create();
  images: Image[] = [];
  fileUpload: FileUpload;
  apartImgCount: number = 0;
  apartmentImagesAdded: boolean = false;
  connectionError: boolean = false;
  landlords: any[] = [];
  noLandlords: boolean = false;
  imagesLoaded: boolean[] = 
  [
      false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, 
      false,false, false, false, false, false, false, false, false, false,
      false,false, false, false, false, false, false, false, false, false,
      false,false, false, false, false, false, false, false, false, false
  ];
  constructor(
  	public navCtrl: NavController, 
  	private storage: LocalDataProvider,
  	private accom_svc: AccommodationsProvider,
  	private object_init: ObjectInitProvider,
  	private toastCtrl: ToastController,
  	private camera: Camera,
  	private errHandler: ErrorHandlerProvider,
  	private file_upload_svc: FileUploadSvcProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private searchfeed_svc: SearchfeedProvider
    ) {
    this.loader.present();
  	this.cancelPic() //Initializing the fileUpload object (just reusing an inappropriatley named method)
  	this.apartment = this.object_init.initializeApartment(); //Initializing an empty apartment object
  	this.storage.getApartment()
  	.then(apart =>{
      //Check if theres an apartment form cache before proceed
      
  		if(apart){
  			console.log('apartment: ', apart )
  			this.apartment = this.object_init.initializeApartment2(apart); //Populating the apartment fields with those from the cache
        this.storage.getUser()
        .then(user =>{
          this.searchfeed_svc.getAgentsLandlords(user.uid)
          .pipe(take(1))
          .subscribe(landlords =>{
            if(landlords.length > 0){
              landlords.forEach(lnd =>{
                this.landlords.push(lnd)
              })
            }else{
              this.noLandlords = true;
            }
          })
        })
  			this.loader.dismiss()
        /*If the images of the apartment are not in array format put them in array otherwise use as is */
  			if(!(apart.images.length > 0)){
  				//console.log('apart images: ', apart.images)
  				let images = Object.keys(apart.images).map(imageId =>{
              this.imagesLoaded.push(false);
			      	return apart.images[imageId]
			    })
          images.forEach(mg =>{
            if(mg != undefined) this.images.push(mg)
          })
			    this.apartImgCount = this.images.length;
  			}else{
  				//console.log('apart images: ', apart.images)
  				apart.images.forEach(mg =>{
            if(mg != undefined) this.images.push(mg)
          })
  				this.apartImgCount = apart.images.length;
  			}
  		}else{
  			this.loader.dismiss()
  		}
  	})
    .catch(err =>{
      this.loader.dismiss()
      this.errHandler.handleError(err)
    })
  }

  ionViewDidLoad() {
    
  }

  gotoBuilding(){
    this.storage.setProperty(this.apartment.property)
    .then(() =>{
      this.navCtrl.push('EditPropertyPage')
    })
    
  }

  //Method for handling deletion of apartment pictures
  remove(index: number){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Delete",
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

  //Save the changes made to the apartment
  save(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Save",
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
        let ldr = this.loadingCtrl.create()
        ldr.present();
        this.apartment.images = this.images;
        console.log(this.images[0])
        if(this.images.length > 0){
          if(this.images[0].url != '' && this.images[0].url != 'assets/imgs/placeholder.jpg'){
            this.apartment.dP = this.images[0]
          }else if(this.images[1].url != '' && this.images[1].url != 'assets/imgs/placeholder.jpg'){
            this.apartment.dP = this.images[1]
          }
        }
        if(this.apartment.quantity_available > 0){
          this.apartment.available = true;
        }else{
          this.apartment.available = false;
        }
        this.accom_svc.updateApartment(this.apartment)
        .then(() =>{
          ldr.dismiss()
          this.toastCtrl.create({
            message: 'The apartment was successfully updated !',
            duration: 5000
          })
          .present()
        })
        .catch(err =>{
          ldr.dismiss()
          this.toastCtrl.create({
            message: err.message,
            duration: 4000
          })
          .present()
        })
      }
    })
  }

  //Method that handles the uploading of apartment images to firebase storage
  uploadApartmentImage(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Upload",
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
        let ldr = this.loadingCtrl.create()
        ldr.present();
        this.file_upload_svc.uploadPic(this.fileUpload)
        .then(imag =>{
          this.images.push(imag);
          ldr.dismiss()
          this.connectionError = false;
          this.toastCtrl.create({
            message: 'Picture added !',
            duration: 3000
          })
          .present()
        })
        .catch(err =>{
          ldr.dismiss()
          if(this.connectionError == true)
          this.toastCtrl.create({
            message: 'Please check your internet connection...images could not be uploaded',
            duration: 4000
          })
          .present()
          this.connectionError = true;
        })
      }
    })
  }

  //Cancel the current image details
  cancelPic(){
  	this.fileUpload = {
  		file: null,
  		name: '',
  		path: '',
  		progress: 0,
  		url: ''
  	}
  }

  //Add a picture to the current apartment image array
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
    })
  }

}
