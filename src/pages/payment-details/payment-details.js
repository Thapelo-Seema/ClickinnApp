var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Calendar } from '@ionic-native/calendar';
import { AngularFirestore } from 'angularfire2/firestore';
//import { ConfirmationPage } from '../confirmation/confirmation';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
/**
 * Generated class for the PaymentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PaymentDetailsPage = /** @class */ (function () {
    function PaymentDetailsPage(navCtrl, navParams, datePicker, confirmCtrl, storage, toast, errHandler, calender, afs, object_init) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.datePicker = datePicker;
        this.confirmCtrl = confirmCtrl;
        this.storage = storage;
        this.toast = toast;
        this.errHandler = errHandler;
        this.calender = calender;
        this.afs = afs;
        this.object_init = object_init;
        this.bank = '';
        this.payment_method = '';
        this.myDate = null;
        this.refference = '';
        this.loading = false;
    }
    PaymentDetailsPage.prototype.generateRef = function () {
    };
    PaymentDetailsPage.prototype.pay = function () {
    };
    PaymentDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-payment-details',
            templateUrl: 'payment-details.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, DatePicker,
            ModalController, LocalDataProvider, ToastController,
            ErrorHandlerProvider, Calendar, AngularFirestore,
            ObjectInitProvider])
    ], PaymentDetailsPage);
    return PaymentDetailsPage;
}());
export { PaymentDetailsPage };
//# sourceMappingURL=payment-details.js.map