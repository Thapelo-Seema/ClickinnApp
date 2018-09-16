import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { Property } from '../../models/properties/property.interface';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { Image } from '../../models/image.interface';
import { storage } from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
import { FileUpload } from '../../models/file-upload.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { MapsProvider } from '../../providers/maps/maps';
import { Address } from '../../models/location/address.interface';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { InfoPage } from '../info/info';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-upload-and-earn',
  templateUrl: 'upload-and-earn.html',
})
export class UploadAndEarnPage{
  service = new google.maps.places.AutocompleteService();
  apartment: Apartment  = {
    available: true,
    dP: {name: 'placeholder', path: 'path', progress: 0,url: "assets/imgs/placeholder.jpg"},
    deposit: 0,
    description: '',
    apart_id: '',
    images: [],
    price: 0,
    prop_id: '',
    room_type: '',
    type: 'loading...',
    timeStamp: 0,
    occupiedBy: this.object_init.initializeTenant()
  }
  building: Property ={
  	address: null,
  	nearbys: [],
  	nsfas: false,
  	wifi: false,
  	laundry: false,
  	common: '',
  	dP: {name: 'placeholder', path: 'path', progress: 0,url: "assets/imgs/placeholder.jpg"},
  	images: [],
  	prop_id: '',
  	timeStamp: 0,
  	user_id: '',
  	parking: false,
  	prepaid_elec: false
  }
  buildings: Property[] = [];
  address: string = '';
  nearby: string = '';
  apartmentImagesAdded: boolean = false;
  propertyImagesAdded:boolean = false;
  apartmentImages: FileUpload[] = [];
  propertyImages: FileUpload[] = [];
  loading: boolean = false;
  apartImgCount: number  = 0;
  buildingImgCount: number  = 0;
  predictionsAdd: any[] = [];
  predictionsNby: any[] = [];
  user: User;
  buildingSelected: boolean = false;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, private errHandler: ErrorHandlerProvider, private platform: Platform,
    private afs: AngularFirestore, private afstorage: AngularFireStorage, private toast: ToastController,
    private map_svc: MapsProvider, private storage: LocalDataProvider, private accom_svc: AccommodationsProvider, 
    private object_init: ObjectInitProvider){
    this.platform.ready().then(val =>{
      this.storage.getUser().then(user =>{ //getting user from local storage
        this.user = user;
        this.building.user_id = user.uid;
        this.accom_svc.getUsersProperties(user.uid).subscribe(buildings =>{
          this.buildings = buildings;
        })
      })
    })
  }

  ionViewDidLoad() {
    //this.showAlert();
  }

  selectChange(e) {
    console.log(e);
  }

  selectEBuilding(building: Property){
    this.building = building;
    this.buildings = [];
    this.buildings.push(building);
    this.buildingSelected = true;
  }

  showAlert(){
    let alert = this.alertCtrl.create({
      title:    'Upload and Earn',
      subTitle: `Get 10% off your next McDonalds meal !!`,
      message: `Upload a vacant apartment and use your upload code to get discount for your next meal at McDonalds`,
      cssClass: 'alertCtrl',
      buttons: ['OK']
    });
    alert.present();
  }

  addPictures(source: number, destination: number){
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: source,
      allowEdit: true,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
       if(destination == 1){
         this.apartImgCount++;
         this.apartmentImagesAdded = true;
         let image: FileUpload ={
           file: 'data:image/jpeg;base64,' + imageData,
           path: 'ApartmentImages',
           url: '',
           name: `${this.apartment.apart_id}_${this.apartImgCount}.jpg`,
           progress: 0
         }
         this.apartmentImages.push(image);
       }
       else if(destination == 2){
         this.buildingImgCount++;
         this.propertyImagesAdded = true;
         let image: FileUpload ={
           file: 'data:image/jpeg;base64,' + imageData,
           path: 'PropertyImages',
           url: '',
           name: `${this.building.prop_id}_${this.buildingImgCount}.jpg`,
           progress: 0
         }
          this.propertyImages.push(image);
       }
    }).catch(err => {
      this.errHandler.handleError({errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected'});
      this.loading = false;
    })
  }

  uploadApartment(){
    console.log('Uploading apartment...');
    this.loading = true;
    this.apartment.property = this.building;
    this.uploadBuildingPics();
      this.afs.collection('Apartments').doc(this.apartment.apart_id).update(this.apartment).then(() =>{
        console.log('Updating apartment...');
        this.afs.collection('Properties').doc(this.building.prop_id).update(this.building).then(() =>{
          console.log('Updating building...');
          this.storage.setApartment(this.apartment).then(apart =>{
            this.successful()
            setTimeout(() =>{this.navCtrl.push(InfoPage)}, 3000)
          })
          .catch(err => console.log(err))
          
          this.loading = false;
        })
        .catch(err =>{
          this.errHandler.handleError(err);
          this.loading = false;
        })
      })
      .catch(err =>{
        this.errHandler.handleError(err);
        this.loading = false;
      })
  }

  selectBuilding(property: Property, images: Image[]){
    this.apartment.property = property; //adding the building profile to the apartment
    images.forEach(image =>{
      this.apartment.property.images.push(image);
    })
  }

  uploadPic(image: FileUpload): Promise<Image>{
    const storageRef =   this.afstorage.ref(`${image.path}/${image.name}`);
     const uploadTask = storageRef.putString(image.file, 'data_url');
     return new Promise<Image>((resolve, reject) => {
      uploadTask.snapshotChanges().subscribe(
        (snapshot) =>{
          //update the progress property of the upload object
          uploadTask.percentageChanges().subscribe(progress =>{
            image.progress = progress;
            console.log('progress... ', image.progress);
          })
        },
        (err) =>{
          //if there's an error log it in the console
          this.errHandler.handleError(err);
          this.loading = false;
        },
        () =>{
          let tempUrl = '';
          //on success of the upload, update the url property of the upload object
          storageRef.getDownloadURL().subscribe(down_url =>{
            tempUrl = down_url;
            }, 
            err =>{
              this.errHandler.handleError(err);
              this.loading = false;
            },
            () =>{
              let image_out: Image = {
                url: tempUrl,
                name: image.name,
                progress: image.progress,
                path: image.path
              }
              resolve(image_out)
            }
          ) 
        }
      )
    })
  }

  uploadPics(pics: FileUpload[]): Promise<Image[]>{
    let images: Image[] = [];
    return new Promise<Image[]>((resolve, reject) =>{
      if(pics){
          pics.forEach(pic =>{
          this.uploadPic(pic).then(image => images.push(image)).catch(err =>{
            this.errHandler.handleError(err);
            this.loading = false;
          });
          if(images.length == pics.length){
            resolve(images);
          }
        })
      }else{
        reject('No images selected');
      }
      
    })
  }

  initialApartUpload(){
    this.loading = true;
    this.afs.collection('Apartments').add(this.apartment).then(apartRef =>{
      this.apartment.apart_id = apartRef.id
      this.loading = false;    
    })
    .catch(err => this.errHandler.handleError(err))
  }

  initialBuildinUpload(){
    this.loading = true;
    this.afs.collection('Properties').add(this.building).then(buildingRef =>{
      this.building.prop_id = buildingRef.id;
      this.loading = false;    
    })
    .catch(err => this.errHandler.handleError(err))
  }

  uploadApartPics(): Promise<void>{
    return this.uploadPics(this.apartmentImages).then(images =>{
      this.apartment.images = images;
    })
    .catch(err => this.errHandler.handleError(err))
  }

  uploadBuildingPics(): Promise<void>{
    return new Promise<void>((resolve, reject) =>{
      this.uploadPics(this.propertyImages).then(images =>{
      this.building.images = images;
      console.log('Building pics uploaded...')
      this.apartment.prop_id = this.building.prop_id;
      this.apartment.property = this.building;
      resolve();
    })
    .catch(err => this.errHandler.handleError(err))
    }) 
  }
  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictionsAdd(event){
    this.loading = true;
    if(event.key === "Backspace" || event.code === "Backspace"){
      setTimeout(()=>{
        this.map_svc.getPlacePredictionsSA(event.target.value, this.service).then(data => {
          console.log(data);
          this.predictionsAdd = [];
          this.predictionsAdd = data;
          this.loading = false;
        })
        .catch(err => {
          this.errHandler.handleError(err);
          this.loading = false;
        })
      }, 3000)
    }else{
      this.map_svc.getPlacePredictionsSA(event.target.value, this.service).then(data => {
        console.log(data);
        this.predictionsAdd = [];
        this.predictionsAdd = data;
        this.loading = false;
      })
      .catch(err => {
        this.errHandler.handleError(err);
        this.loading = false;
      })
    }
  }
  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictionsNby(event){
    this.loading = true;
    if(event.key === "Backspace" || event.code === "Backspace"){
      setTimeout(()=>{
        this.map_svc.getPlacePredictionsSA(event.target.value, this.service).then(data => {
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
      this.map_svc.getPlacePredictionsSA(event.target.value, this.service).then(data => {
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

  selectPlace(place){
    this.loading = true;
    this.map_svc.getSelectedPlace(place).then(data => {
      this.building.address = data;
      this.address = data.description;
      this.predictionsAdd = [];
      this.loading = false;
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  addNearby(nearby: string){
    this.building.nearbys.push(nearby);
    this.nearby = '';
    this.predictionsNby = [];
    console.log('added ', nearby);
  }

  successful(){
    this.toast.create({
      message: "Apartment successfully uploaded!",
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'middle',
      cssClass: 'toast_margins full_width'
    })
    .present().then(() =>{
      this.loading = false;
    })
  }

  deleteNearby(nearby:string) {
    const index: number = this.building.nearbys.indexOf(nearby);
    if (index !== -1) {
        this.building.nearbys.splice(index, 1);
    }        
  }

}
