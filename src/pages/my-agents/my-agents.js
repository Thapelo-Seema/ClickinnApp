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
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the MyAgentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MyAgentsPage = /** @class */ (function () {
    function MyAgentsPage(navCtrl, navParams, storage, alert, afs, errHandler, object_init, alertCtrl, user_svc, searchfeed_svc, toast_svc, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.alert = alert;
        this.afs = afs;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.alertCtrl = alertCtrl;
        this.user_svc = user_svc;
        this.searchfeed_svc = searchfeed_svc;
        this.toast_svc = toast_svc;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.noAgents = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        this.storage.getUser()
            .then(function (data) {
            _this.user = _this.object_init.initializeUser2(data);
            _this.serviceDeals = _this.searchfeed_svc.getLandlordAgentProposals(data.uid);
            _this.searchfeed_svc.getLandlordAgentProposals(data.uid)
                .pipe(take(1))
                .subscribe(function (lords) {
                _this.loader.dismiss();
                if (lords.length > 0) {
                    lords.forEach(function (lord) {
                        _this.imagesLoaded.push(false);
                    });
                }
                else {
                    _this.noAgents = true;
                }
                console.log('Deals: ', lords);
            });
        });
    }
    MyAgentsPage.prototype.ionViewDidLoad = function () {
    };
    MyAgentsPage.prototype.cancelDeal = function (deal) {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Cancel Services",
            message: "Are you sure you want to cancel the services of this agent ?",
            buttons: [
                {
                    text: 'Yes cancel services',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'No nevermind',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                var ldr_1 = _this.loadingCtrl.create();
                ldr_1.present();
                var svc = deal;
                svc.landlord_disagree = true;
                _this.searchfeed_svc.updateProposal(svc)
                    .then(function () {
                    ldr_1.dismiss();
                    _this.toast_svc.showToast('The services of this agent have been discontinued');
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    ldr_1.dismiss();
                });
            }
        });
    };
    MyAgentsPage.prototype.acceptDeal = function (deal) {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Accept Services",
            message: "Are you sure you want to accept the services of this agent ?",
            buttons: [
                {
                    text: 'Yes accept services',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'No nevermind',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                var ldr_2 = _this.loadingCtrl.create();
                ldr_2.present();
                var svc = deal;
                svc.landlord_agreed = true;
                svc.landlord_disagree = false;
                _this.searchfeed_svc.updateProposal(svc)
                    .then(function () {
                    ldr_2.dismiss();
                    _this.toast_svc.showToast('The services of this agent have been accepted');
                })
                    .catch(function (err) {
                    ldr_2.dismiss();
                    _this.errHandler.handleError(err);
                });
            }
        });
    };
    MyAgentsPage.prototype.showInput = function (deal) {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        var to;
        to = {
            uid: deal.agent_uid,
            dp: deal.agent_dp,
            name: deal.agent_firstname ? deal.agent_firstname : '',
            topic: "Regarding the agent services between you and " + deal.landlord_firstname
        };
        this.storage.setMessageDetails(to).then(function (val) {
            ldr.dismiss();
            _this.alert.create('MessageInputPopupPage', to).present();
        });
    };
    MyAgentsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-my-agents',
            templateUrl: 'my-agents.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider,
            ModalController,
            AngularFirestore,
            ErrorHandlerProvider,
            ObjectInitProvider,
            AlertController,
            UserSvcProvider,
            SearchfeedProvider,
            ToastSvcProvider,
            LoadingController])
    ], MyAgentsPage);
    return MyAgentsPage;
}());
export { MyAgentsPage };
//# sourceMappingURL=my-agents.js.map