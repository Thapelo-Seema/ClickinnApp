var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/merge';
import { map } from 'rxjs-compat/operators/map';
import { take } from 'rxjs/operators/take';
/*
  Generated class for the DepositProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var DepositProvider = /** @class */ (function () {
    /*private _done = new BehaviorSubject(false);
    private _loading = new BehaviorSubject(false);
    private _data = new BehaviorSubject([]);*/
    // Observable data
    /*data: Observable<any>;
    done: Observable<boolean> = this._done.asObservable();
    loading: Observable<boolean> = this._loading.asObservable();*/
    function DepositProvider(afs) {
        this.afs = afs;
        //console.log('Hello DepositProvider Provider');
    }
    DepositProvider.prototype.addDeposit = function (deposit) {
        return __awaiter(this, void 0, void 0, function () {
            var lDep, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lDep = deposit;
                        return [4 /*yield*/, this.afs.collection('Deposits').add(deposit)];
                    case 1:
                        id = _a.sent();
                        lDep.id = id.id;
                        return [2 /*return*/, this.afs.collection('Deposits').doc(id.id).set(lDep)];
                }
            });
        });
    };
    DepositProvider.prototype.updateUserBalance = function (uid, amount) {
        var _this = this;
        this.afs.collection('Users').doc(uid).valueChanges()
            .pipe(take(1))
            .subscribe(function (user) {
            var newUser = user;
            newUser.balance += amount;
            _this.afs.collection('Users').doc(uid).set(newUser);
        });
    };
    DepositProvider.prototype.updateDeposit = function (deposit) {
        return this.afs.collection('Deposits').doc(deposit.id).set(deposit);
    };
    DepositProvider.prototype.getPricing = function () {
        return this.afs.collection('Clickinn_Pricing').doc('AZgFu6nqYzZrdKm5Kd1m').valueChanges();
    };
    DepositProvider.prototype.getDepositById = function (id) {
        return this.afs.collection('Deposits').doc(id)
            .valueChanges();
    };
    DepositProvider.prototype.getHostDeposits = function (uid) {
        return this.afs.collection('Deposits', function (ref) {
            return ref.where('to.uid', '==', uid);
        }).valueChanges();
    };
    DepositProvider.prototype.getTenantDeposits = function (uid) {
        return this.afs.collection('Deposits', function (ref) {
            return ref.where('by.uid', '==', uid);
        }).valueChanges();
    };
    DepositProvider.prototype.getUserDeposits = function (uid) {
        return this.afs.collection('Deposits', function (ref) { return ref.orderBy('time_initiated', 'desc'); }).valueChanges()
            .pipe(map(function (deps) { return deps.filter(function (dep) { return (dep.by.uid == uid) || (dep.to.uid == uid); }); }));
    };
    /*initGetHostDeposits(uid: string){
      const first = this.afs.collection('Deposits', ref =>
        ref.where('to.uid', '==', uid)
        .orderBy('timeStamp', 'desc')
        .limit(15)
      )
  
      this.mapAndUpdate(first)
  
      this.data = this._data.asObservable()
      .scan((acc, val) =>{
        return acc.concat(val)
      })
    }*/
    /*moreHostDeposits(uid: string){
      const cursor = this.getCursor()
      const more = this.afs.collection('Deposits', ref =>
        ref.where('to.uid', '==', uid)
        .orderBy('timeStamp', 'desc')
        .limit(15)
        .startAfter(cursor)
      )
  
      this.mapAndUpdate(more)
    }*/
    DepositProvider.prototype.getTenantDepsits = function (uid) {
        return this.afs.collection('Deposits', function (ref) { return ref.where('by.uid', '==', uid); });
    };
    DepositProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore])
    ], DepositProvider);
    return DepositProvider;
}());
export { DepositProvider };
//# sourceMappingURL=deposit.js.map