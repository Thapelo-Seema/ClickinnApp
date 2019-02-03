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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepositProvider } from '../../providers/deposit/deposit';
//import { take } from 'rxjs-compat/operators/take';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the DepositsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DepositsPage = /** @class */ (function () {
    function DepositsPage(navCtrl, navParams, dep_svc, storage, toast_svc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dep_svc = dep_svc;
        this.storage = storage;
        this.toast_svc = toast_svc;
        this.loading = true;
        this.balance = 0;
        this.depIds = [];
        this.noPayments = false;
        this.storage.getUser().then(function (user) {
            _this.user = user;
            _this.deposits = _this.dep_svc.getUserDeposits(user.uid);
            _this.depositsSubs = _this.dep_svc.getUserDeposits(user.uid)
                .subscribe(function (deps) {
                console.log('subscribing to deposits...');
                if (deps.length > 0) {
                    _this.loading = false;
                    deps.forEach(function (dep) {
                        if (dep.to.uid == user.uid && !dep.transaction_closed && (_this.depIds.indexOf(dep.id) == -1)) {
                            if (dep.apartment.by && dep.apartment.by == 'Agent') {
                                _this.depIds.push(dep.id);
                                _this.balance += dep.agent_commision;
                            }
                            else {
                                _this.depIds.push(dep.id);
                                _this.balance += dep.landlord_credit;
                            }
                        }
                        console.log(_this.balance);
                    });
                    _this.user.balance = _this.balance;
                    _this.dep_svc.updateUserBalance(user.uid, _this.balance);
                }
                else {
                    _this.loading = false;
                    _this.noPayments = true;
                    //this.toast_svc.showToast('You have no deposit transactions on this profile...')
                }
            }, function (err) {
                _this.toast_svc.showToast(err.message);
                _this.loading = false;
            });
        });
    }
    DepositsPage.prototype.ionViewDidLoad = function () {
        //console.log('ionViewDidLoad DepositsPage');
    };
    DepositsPage.prototype.ionViewWillLeave = function () {
        console.log('deposits page unsubscrinbing...');
        this.depositsSubs.unsubscribe();
    };
    DepositsPage.prototype.gotoHostAcceptDeposit = function (deposit_id) {
        var _this = this;
        this.storage.setTransactionState({ type: 'host_accept_deposit', id: deposit_id })
            .then(function (dat) {
            _this.navCtrl.push('DepositConfirmationPage');
        });
    };
    DepositsPage.prototype.gotoSeekerConfirmDeposit = function (deposit_id) {
        var _this = this;
        this.storage.setTransactionState({ type: 'seeker_confirm_deposit', id: deposit_id })
            .then(function (dat) {
            _this.navCtrl.push('DepositConfirmationPage');
        });
    };
    DepositsPage.prototype.gotoDeposit = function (deposit) {
        if (deposit.by.uid == this.user.uid) {
            this.gotoSeekerConfirmDeposit(deposit.id);
        }
        else {
            this.gotoHostAcceptDeposit(deposit.id);
        }
    };
    DepositsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-deposits',
            templateUrl: 'deposits.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            DepositProvider,
            LocalDataProvider,
            ToastSvcProvider])
    ], DepositsPage);
    return DepositsPage;
}());
export { DepositsPage };
//# sourceMappingURL=deposits.js.map