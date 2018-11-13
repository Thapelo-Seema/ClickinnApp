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
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
var ChatServiceProvider = /** @class */ (function () {
    function ChatServiceProvider(afs) {
        this.afs = afs;
    }
    /**This function checks if the sender has the reciever already as part of their contact list and if so it will return
      an object that contains the thread_id on which the two users chat else the object returned will contain an empty string
      fo the thread_id
    */
    ChatServiceProvider.prototype.isContact = function (uid, threads) {
        console.log('contact uid: ', uid);
        var match = { match: false, thread_id: '' };
        if (threads.length != undefined && threads.length > 0) {
            for (var _i = 0, threads_1 = threads; _i < threads_1.length; _i++) {
                var thread = threads_1[_i];
                console.log('Potential match:  ', thread.uid);
                if (thread.uid == uid) {
                    console.log('match found: ', thread.thread_id);
                    return { match: true, thread_id: thread.thread_id };
                }
            }
        }
        else if (threads) {
            var threadss = Object.keys(threads);
            for (var _a = 0, threadss_1 = threadss; _a < threadss_1.length; _a++) {
                var thread = threadss_1[_a];
                console.log('Potential match:  ', thread);
                if (thread == uid) {
                    //console.log('match found: ', user.threads.thread.thread_id)
                    return { match: true, thread_id: thread };
                }
            }
        }
        return match;
    };
    /**
      This function creates a new chat thread between two users and pushes the message inside the thread
    */
    ChatServiceProvider.prototype.createNewThread = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var docRef, thread_id;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.afs.collection('Threads').add({})];
                    case 1:
                        docRef = _a.sent();
                        thread_id = docRef.id;
                        this.afs.collection("Threads/" + thread_id + "/chats").add(msg);
                        /*console.log('Thread id', thread_id);
                        this.db.list(`Threads/${thread_id}`).push(msg);*/
                        this.afs.collection("Users")
                            .doc(msg.to.uid)
                            .collection('threads')
                            .doc(msg.by.uid)
                            .set({ thread_id: thread_id, uid: msg.by.uid,
                            displayName: msg.by.displayName, dp: msg.by.dp })
                            .then(function () {
                            _this.afs.collection("Users")
                                .doc(msg.by.uid)
                                .collection('threads')
                                .doc(msg.to.uid)
                                .set({ thread_id: thread_id, uid: msg.to.uid,
                                displayName: msg.to.displayName, dp: msg.to.dp })
                                .then(function () { return console.log('Done setting threads...'); })
                                .catch(function (err) { return console.log(err); });
                        })
                            .catch(function (err) {
                            console.log(err);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatServiceProvider.prototype.sendMessage = function (msg, threads) {
        console.log('Message: ', msg);
        var results = this.isContact(msg.to.uid, threads);
        console.log('results: ', results);
        if (results.match) {
            this.afs.collection("Threads").doc(results.thread_id).collection('chats').add(msg);
        }
        else {
            this.createNewThread(msg);
        }
    };
    ChatServiceProvider.prototype.getThreadChats = function (thread_id) {
        return this.afs.collection("Threads").doc(thread_id).collection('chats', function (ref) { return ref.orderBy('timeStamp', 'asc'); }).valueChanges();
    };
    ChatServiceProvider.prototype.getThreads = function (user) {
        return this.afs.collection('Users').doc(user.uid).collection('threads').valueChanges();
    };
    ChatServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore])
    ], ChatServiceProvider);
    return ChatServiceProvider;
}());
export { ChatServiceProvider };
//# sourceMappingURL=chat-service.js.map