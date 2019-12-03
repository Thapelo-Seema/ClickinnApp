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
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'clickinn.accommodation@gmail.com',
        pass: 'I_love_clickinn123'
    }
});
exports.sendMail = functions.https.onRequest((req, res) => {
    const sender = req.query.sender;
    const msg = req.query.msg;
    cors(req, res, () => {
        // getting dest email by query string
        const dest = req.query.dest;
        const mailOptions = {
            from: 'Clickinn Accommodation <clickinn.accommodation@gmail.com>',
            to: dest,
            subject: `${sender} has responded to your search on Clickinn Accommodation`,
            html: `<p style="font-size: 16px;"> ${msg} </p>
                <br />
            ` // email content in HTML
        };
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});
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
            title: `Clickinn Viewing Appointment`,
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
            title: `Clickinn Deposit`,
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
exports.svcRequestNotification = functions.firestore.document(`AgentProposals/{deal_id}`)
    .onCreate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const data = event.data();
    console.log('event data: ', event.data());
    const agent = {
        dp: data.agent_dp,
        firstname: data.agent_firstname,
        lastname: data.agent_lastname,
        uid: data.agent_uid,
        phoneNumber: data.agent_phoneNumber
    };
    const landlord = {
        dp: data.landlord_dp,
        firstname: data.landlord_firstname,
        lastname: data.landlord_lastname,
        uid: data.landlord_uid,
        phoneNumber: data.landlord_phoneNumber
    };
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
	alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `Clickinn Agent Proposal`,
            body: `${agent.firstname} is requesting to provide you with agent services`,
            icon: agent.dp ? agent.dp : clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            badge: '1',
            key_code: 'agent_proposal',
            id: context.params.deal_id,
            priority: 'high',
            'content-available': '1'
        }
    };
    const db = admin.firestore();
    console.log('Host: ', landlord.uid);
    const deviceRef = db.collection('Tokens').where('uid', '==', landlord.uid);
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
exports.serviceConfirmation = functions.firestore.document(`AgentProposals/{deal_id}`)
    .onUpdate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const dealBefore = event.before.data();
    const dealAfter = event.after.data();
    let notifyObject;
    let code = '';
    if (dealAfter.landlord_agreed !== dealBefore.landlord_agreed) {
        code = 'landlord_proposal_agreed';
        notifyObject = {
            message: `${dealAfter.landlord_firstname} has agreed to your agent services`,
            to: dealAfter.agent_uid
        };
    }
    else if (dealAfter.landlord_disagree !== dealBefore.landlord_disagree) {
        code = 'landlord_proposal_declined';
        notifyObject = {
            message: `${dealAfter.landlord_firstname} has declined your agent services`,
            to: dealAfter.agent_uid
        };
    }
    else if (dealAfter.agent_cancelled !== dealBefore.agent_cancelled) {
        code = 'agent_proposal_cancelled';
        notifyObject = {
            message: `${dealAfter.agent_firstname} has cancelled their agent services to you`,
            to: dealAfter.landlord_uid
        };
    }
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
		alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        data: {
            title: `Clickinn Agent Services`,
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
            title: `Clickinn Viewing Appointment`,
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
            message: `Clickinn confirms that payment has been made for the ${depositAfter.apartment.room_type} at ${depositAfter.apartment.property.address.description.split(',')[0] + depositAfter.apartment.property.address.description.split(',')[1]}`,
            to: depositAfter.to.uid
        };
    }
    else if (depositAfter.tenant_confirmed !== depositBefore.tenant_confirmed) {
        if (depositAfter.tenant_confirmed) {
            code = 'tenant_confirmed_deposit';
            notifyObject = {
                message: `${depositAfter.by.firstname} confirmed the deposit of the ${depositAfter.apartment.room_type} at ${depositAfter.apartment.property.address.description.split(',')[0] + depositAfter.apartment.property.address.description.split(',')[1]}`,
                to: depositAfter.to.uid
            };
        }
        else {
            code = 'tenant_cancelled_deposit';
            notifyObject = {
                message: `${depositAfter.by.firstname} cancelled the deposit of the ${depositAfter.apartment.room_type} at ${depositAfter.apartment.property.address.description.split(',')[0] + depositAfter.apartment.property.address.description.split(',')[1]}`,
                to: depositAfter.to.uid
            };
        }
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
            title: `Clickinn Secure Payment`,
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
            title: `New Message From ${by.displayName}`,
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
            title: `New Message From ${by.displayName}`,
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
//agent noti
exports.searchNotifier = functions.firestore.document('Searches2/{search_id}')
    .onCreate((event, context) => __awaiter(this, void 0, void 0, function* () {
    const data = event.data();
    console.log('event data: ', event.data());
    const searchAddress = data.Address;
    const clickinn_icon = `https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?
	alt=media&token=6c24891a-8e7d-43f6-ab84-5f196fdf4ed5`;
    const payload = {
        notification: {
            title: `Clickinn Search`,
            body: `Someone searched for a place in your area`,
            icon: clickinn_icon,
            sound: 'default',
            vibrate: 'true',
            priority: 'high'
        }
    };
    const db = admin.firestore();
    const agent_ids = [];
    const tokens = [];
    //Go through each users locations array and check if the it matches the current location
    //We need to iterate through the users locations as we test
    //If it does, put that users uid in a temp array
    const agentRef = db.collection('Users').where('user_type', '==', 'agent');
    const agents = yield agentRef.get();
    agents.forEach(agent => {
        const agentDetails = agent.data();
        console.log(agentDetails);
        for (const area of agentDetails.locations) {
            console.log("area: ", area);
            if (area.locality_short === searchAddress.locality_short) {
                agent_ids.push(agentDetails.uid);
                break;
            }
        }
    });
    agent_ids.forEach((agent_id) => __awaiter(this, void 0, void 0, function* () {
        const deviceRef = db.collection('Tokens').where('uid', '==', agent_id);
        const devices = yield deviceRef.get();
        //console.log('Devices: ', devices.docs);
        devices.forEach(device => {
            console.log('Device: ', device.data().token);
            if (tokens.indexOf(device.data().token) === -1) {
                console.log('pushing token...');
                tokens.push(device.data().token);
            }
        });
    }));
    console.log('Tokens: ', tokens);
    return admin.messaging().sendToDevice(tokens, payload);
}));
//# sourceMappingURL=index.js.map