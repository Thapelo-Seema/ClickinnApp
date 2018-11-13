import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Content } from 'ionic-angular';
import { Property } from '../../models/properties/property.interface';
import { Apartment } from '../../models/properties/apartment.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { Observable } from 'rxjs-compat/observable';
//import { AccommodationsComponent } from '../../components/accommodations/accommodations';
import { Image } from '../../models/image.interface';
import { FileUpload } from '../../models/file-upload.interface';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { FileUploadSvcProvider } from '../../providers/file-upload-svc/file-upload-svc';
import { MapsProvider } from '../../providers/maps/maps';

/**
 * Generated class for the EditPropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-property',
  templateUrl: 'edit-property.html',
})
export class EditPropertyPage {
  property: Property;
  @ViewChild(Content) content: Content;
  apartments: Observable<Apartment[]>;
  loading: boolean = true;
  loadingMore: boolean = false;
  done: boolean = false;
  images: Image[] = [];
  fileUploads: FileUpload[] = [];
  propImgCount: number = 0;
  propertyImagesAdded: boolean = false;
  showAddedImages: boolean = false;
  nearby: string = '';
  predictionsNby: any[] = [];
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
  	private accom_svc: AccommodationsProvider,
  	private local_db: LocalDataProvider,
  	private object_init: ObjectInitProvider,
    private toastCtrl: ToastController,
    private camera: Camera,
    private errHandler: ErrorHandlerProvider,
    private file_upload_svc: FileUploadSvcProvider,
    private map_svc: MapsProvider,
    private alertCtrl: AlertController) {
    this.accom_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.accom_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })
  	this.property = this.object_init.initializeProperty();
  	this.local_db.getProperty().then(prop =>{
  		if(prop){
  			this.property = this.object_init.initializeProperty2(prop);
  			this.images = [];
        if(!(prop.images.length > 0)){
  		    this.images = Object.keys(prop.images).map(imageId =>{
            this.imagesLoaded.push(false);
  		      return prop.images[imageId]
  		    })
        }else{
          console.log('apart images: ', prop.images)
          this.images = prop.images;
          this.propImgCount = prop.images.length;
        }
		    console.log(this.images);
  			//this.apartments = this.accom_svc.getPropertyApartments(prop.prop_id);
  			this.accom_svc.getPropertyApartments(prop.prop_id)
  			
  			this.accom_svc.getPropertyById(prop.prop_id)
  			.pipe(
  				take(1)
  			)
  			.subscribe(ppty =>{
  				this.property = this.object_init.initializeProperty2(ppty);
  			})
  		}
  	})
  }

  ionViewDidLoad() {
    this.monitorEnd();
  }

  gotoApartment(apartment: Apartment){
    this.local_db.setApartment(apartment).then(data => this.navCtrl.push('EditApartmentPage'))
    .catch(err => {
      console.log(err);
      this.loading = false;
    });
  }

  remove(index: number){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm picture deletion",
      message: 'Are you sure you want to delete this picture ?',
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
      if(index >= 0 && confirm == true){
        this.images.splice(index, 1);
      }
    })
  }

  save(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm changes",
      message: 'Are you sure you want to save the changes you made to this property ?',
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
        this.property.images = this.images;
        this.accom_svc.updateProperty(this.property)
        .then(() =>{
          this.loading = false;
          this.toastCtrl.create({
            message: 'The property was successfully updated !',
            duration: 5000
          })
          .present()
          this.showAddedImages = false;
        })
        .catch(err =>{
          console.log(err);
        })
      }
    })
  }

  uploadPropertyImage(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm intention",
      message: 'Are sure you want to add this image to the property profile ?',
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
        this.file_upload_svc.uploadPics(this.fileUploads)
        .then(imag =>{
          imag.forEach(im =>{
            this.images.push(im);
          })
          this.loading = false;
          this.toastCtrl.create({
            message: 'Pictures updated !',
            duration: 3000
          })
          .present()
        })
        .catch(err =>{
          console.log(err);
          this.loading = false;
        })
      }
    })
  }

  deleteNearby(nearby:string) {
    const index: number = this.property.nearbys.indexOf(nearby);
    if (index !== -1) {
        this.property.nearbys.splice(index, 1);
    }        
  }

  addNearby(nearby: string){
    this.property.nearbys.push(nearby);
    this.nearby = '';
    this.predictionsNby = [];
    console.log('added ', nearby);
  }


  cancelPic(index){
    if(confirm('Do you really want to remove this image ?')){
      this.fileUploads.splice(index);
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
         this.propImgCount++;
         this.propertyImagesAdded = true;
         this.fileUploads.push({
           file: 'data:image/jpeg;base64,' + imageData,
           path: 'ApartmentImages',
           url: '',
           name: `${this.property.prop_id}_${this.propImgCount}.jpg`,
           progress: 0
         }) 
    })
    .then(() =>{
      this.uploadPropertyImage();
    })
    .catch(err => {
      this.errHandler.handleError({errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected'});
      this.loading = false;
    })
  }

  getPredictionsNby(event){
    this.loading = true;
    if(event.key === "Backspace" || event.code === "Backspace"){
      setTimeout(()=>{
        this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
          console.log(data);
          this.predictionsNby = [];
          this.predictionsNby = data;
          this.loading = false;
        })
        .catch(err => {
          this.errHandler.handleError(err);
          this.loading = false;
        })
      }, 3000)
    }else{
      this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
        console.log(data);
        this.predictionsNby = [];
        this.predictionsNby = data;
        this.loading = false;
      })
      .catch(err => {
        this.errHandler.handleError(err);
        this.loading = false;
      })
    }
  }

  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.accom_svc.morePropertyApartments(this.property)
      }
    })
  }

}
