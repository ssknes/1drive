const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.getUID = functions.https.onRequest((req, res) => {
    const cors = require('cors')({ origin: true });
    cors(req, res, () => {
        admin.auth().verifyIdToken(req.query.token).then(decodedToken => {
            return res.send(decodedToken.uid);
        }).catch(error => {
            return res.send(error);
        });
    });
});

exports.getUserData = functions.https.onRequest((req,res)=>{
    const cors = require('cors')({ origin: true });
    cors(req, res, () => {
        admin.auth().verifyIdToken(req.query.token).then(decodedToken => {
            return res.send(decodedToken);
        }).catch(error => {
            return res.status(500).send(error);
        });
    });
})