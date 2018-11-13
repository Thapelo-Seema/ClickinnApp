"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.bookingNotification = functions.firestore.document(`Viewings/{viewing_id}`)
    .onCreate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const data = event.data();
    console.log('event data: ', event.data());
    const booker = {
        displayName: data.booker_name,
        dp: data.bookerDp
    };
    const host = {
        displayName: data.host_name,
        uid: data.host_id
    };
    const room_type = data.room_type;
    const address = data.address;
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
	alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `Clickinn viewing appointment`,
            body: `${booker.displayName} wants to view the ${room_type} at ${address}`,
            icon: booker.dp ? booker.dp : clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: 'seeker_appointment',
            priority: 'high',
            'content-available': '1'
        }
    };
    const db = admin.firestore();
    console.log('Host: ', host.uid);
    const deviceRef = db.collection('Tokens').where('uid', '==', host.uid);
    const devices = yield deviceRef.get();
    const tokens = [];
    console.log('Devices: ', devices.docs);
    devices.forEach(device => {
        console.log('Device: ', device);
        tokens.push(device.data().token);
    });
    console.log('Tokens: ', tokens);
    return admin.messaging().sendToDevice(tokens, payload);
}));
exports.depositNotification = functions.firestore.document(`Deposits/{deposit_id}`)
    .onCreate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const data = event.data();
    console.log('event data: ', event.data());
    const tenant = data.by;
    const host = data.to;
    const room_type = data.apartment.room_type;
    const address = data.apartment.property.description;
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
	alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `Clickinn deposit alert`,
            body: `${tenant.firstname} wants to deposit the ${room_type} at ${address}, should they go ahead ?`,
            icon: tenant.dp ? tenant.dp : clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: 'host_accept_deposit',
            deposit_id: context.params.deposit_id,
            priority: 'high',
            'content-available': '1'
        }
    };
    const db = admin.firestore();
    console.log('Host: ', host.uid);
    const deviceRef = db.collection('Tokens').where('uid', '==', host.uid);
    const devices = yield deviceRef.get();
    const tokens = [];
    console.log('Devices: ', devices.docs);
    devices.forEach(device => {
        console.log('Device: ', device);
        tokens.push(device.data().token);
    });
    console.log('Tokens: ', tokens);
    return admin.messaging().sendToDevice(tokens, payload);
}));
exports.bookingConfirmation = functions.firestore.document(`Viewings/{viewing_id}`)
    .onUpdate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const appointmentBefore = event.before.data();
    const appointmentAfter = event.after.data();
    let notifyObject;
    let code = '';
    if (appointmentAfter.host_confirms !== appointmentBefore.host_confirms) {
        code = 'host_confirmed';
        notifyObject = {
            message: `${appointmentAfter.booker_name} your viewing appointment of the ${appointmentAfter.room_type} at ${appointmentAfter.address} has been accepted by the manager of the property`,
            to: appointmentAfter.booker_id
        };
    }
    else if (appointmentAfter.host_declines !== appointmentBefore.host_declines) {
        code = 'host_declined';
        notifyObject = {
            message: `${appointmentAfter.booker_name} unfortunately your viewing appointment of the ${appointmentAfter.room_type} at ${appointmentAfter.address} has been declined by the manager of the property`,
            to: appointmentAfter.booker_id
        };
    }
    else if (appointmentAfter.seeker_cancels !== appointmentBefore.seeker_cancels) {
        code = 'seeker_cancelled';
        notifyObject = {
            message: `Unfortunately the viewing appointment of the ${appointmentAfter.room_type} at ${appointmentAfter.address} has been cancelled by the potential tenant`,
            to: appointmentAfter.host_id
        };
    }
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
		alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `Clickinn viewing appointment`,
            body: notifyObject.message,
            icon: clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: code,
            priority: 'high',
            'content-available': '1'
        }
    };
    const db = admin.firestore();
    const deviceRef = db.collection('Tokens').where('uid', '==', notifyObject.to);
    const devices = yield deviceRef.get();
    const tokens = [];
    console.log('Devices: ', devices.docs);
    devices.forEach(device => {
        console.log('Device: ', device);
        tokens.push(device.data().token);
    });
    console.log('Tokens: ', tokens);
    return admin.messaging().sendToDevice(tokens, payload);
}));
exports.depositConfirmation = functions.firestore.document(`Deposits/{deposit_id}`)
    .onUpdate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const depositBefore = event.before.data();
    const depositAfter = event.after.data();
    let notifyObject = null;
    let code = '';
    if (depositAfter.clickinn_confirmed !== depositBefore.clickinn_confirmed) {
        code = 'clickinn_confirmed_deposit';
        notifyObject = {
            message: `Clickinn confirms that payment has been made for the ${depositAfter.apartment.room_type} at ${depositAfter.apartment.property.address.description}`,
            to: depositAfter.to.uid
        };
    }
    else if (depositAfter.tenant_confirmed !== depositBefore.tenant_confirmed) {
        code = 'tenant_confirmed_deposit';
        notifyObject = {
            message: `${depositAfter.by.firstname} confirmed the deposit of the ${depositAfter.apartment.room_type} at ${depositAfter.apartment.property.address.description}`,
            to: depositAfter.to.uid
        };
    }
    else if (depositAfter.agent_confirmed !== depositBefore.agent_confirmed) {
        code = 'agent_confirmed_deposit';
        notifyObject = {
            message: `Your accommodation deposit has been confirmed, you can make arrangements with the property manager for moving in `,
            to: depositAfter.by.uid
        };
    }
    else if (depositAfter.agent_goAhead !== depositBefore.agent_goAhead) {
        code = 'agent_deposit_goAhead';
        if (depositAfter.agent_goAhead) {
            notifyObject = {
                message: `Click here to go ahead with the deposit of the R${depositAfter.apartment.price} ${depositAfter.apartment.room_type}`,
                to: depositAfter.by.uid
            };
        }
        else {
            notifyObject = {
                message: `Unfortunately your request to deposit the R${depositAfter.apartment.price} ${depositAfter.apartment.room_type} has been declined, please do not go ahead with the deposit`,
                to: depositAfter.by.uid
            };
        }
    }
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
		alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `Clickinn viewing appointment`,
            body: notifyObject.message,
            icon: clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: code,
            deposit_id: context.params.deposit_id,
            priority: 'high',
            'content-available': '1'
        }
    };
    const db = admin.firestore();
    const deviceRef = db.collection('Tokens').where('uid', '==', notifyObject.to);
    const devices = yield deviceRef.get();
    const tokens = [];
    console.log('Devices: ', devices.docs);
    devices.forEach(device => {
        console.log('Device: ', device);
        tokens.push(device.data().token);
    });
    console.log('Tokens: ', tokens);
    return admin.messaging().sendToDevice(tokens, payload);
}));
exports.newThreadNotification = functions.firestore.document(`Threads/{thread_id}`)
    .onCreate((event, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('data: ', event.data());
    const data = event.data();
    const by = data.by;
    const to = data.to;
    const text = data.text;
    const thread = context.params.thread_id;
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
    alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `New message from ${by.displayName}`,
            body: text,
            icon: by.dp ? by.dp : clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: 'new_message',
            priority: 'high',
            'content-available': '1',
            thread_id: thread
        }
    };
    const db = admin.firestore();
    const deviceRef = db.collection('Tokens').where('uid', '==', to.uid);
    const devices = yield deviceRef.get();
    const tokens = [];
    devices.forEach(device => {
        tokens.push(device.data().token);
    });
    return admin.messaging().sendToDevice(tokens, payload);
}));
exports.chatMessageNotification = functions.firestore.document(`Threads/{thread_id}/chats/{chat_id}`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    const data = change.after.data();
    const by = data.by;
    const to = data.to;
    const text = data.text;
    const thread_id = context.params.thread_id;
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
    alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `New message from ${by.displayName}`,
            body: text,
            icon: by.dp ? by.dp : clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: 'new_message',
            priority: 'high',
            'content-available': '1',
            thread_id: thread_id
        }
    };
    const db = admin.firestore();
    const deviceRef = db.collection('Tokens').where('uid', '==', to.uid);
    const devices = yield deviceRef.get();
    const tokens = [];
    devices.forEach(device => {
        tokens.push(device.data().token);
    });
    return admin.messaging().sendToDevice(tokens, payload);
}));
//# sourceMappingURL=index.js.map