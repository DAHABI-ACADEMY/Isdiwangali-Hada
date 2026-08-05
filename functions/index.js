const functions = require("firebase-functions");
const admin =  require('firebase-admin');
const cors = require('cors')({origin: true})
const ADMIN_FUNCTION_SECRET = process.env.ADD_ADMIN_SECRET || functions.config().admin?.secret;
admin.initializeApp(functions.config().firebase)

const createNotification = ((notification) => {
    return admin.firestore().collection('notifications')
      .add(notification);
  });
  

exports.newNotificationAdded = functions
    .firestore
    .document('adminnotifications/{adminnotificationId}')
    .onCreate(
    doc =>{
        const newNotification = doc.data();
        return createNotification(newNotification) 
    }
)


exports.addAdmin = functions.https.onRequest(async (req, res) => {
  cors(req, res, async() => {
      try {
        const requestSecret = req.headers['x-admin-secret'];
        if (!ADMIN_FUNCTION_SECRET || requestSecret !== ADMIN_FUNCTION_SECRET) {
          return res.status(403).json({ error: 'Unauthorized' });
        }

        const newAdmin = {
            email: req.body.email,
            password: req.body.password,
        }

        const adminRecord = await admin
            .auth()
            .createUser(newAdmin);

        const userId = adminRecord.uid;

        await admin.firestore().collection("users").doc(userId).set({
          email: req.body.email,
          name: req.body.name,
          userType: 'Admin',
          phone: req.body.phone,
        });
  
        return res.status(201).json({ result: 'The new admin has been successfully created.' });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to create admin' });
    }
  })
})