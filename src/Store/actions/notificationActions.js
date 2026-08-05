export const addNewNotification = (notification) => {
    return (dispatch, getState, {getFirestore, getFirebase}) => {
        const firestore = getFirestore();

        firestore
            .add({collection: 'adminnotifications'},
                {
                    title: notification.title,
                    desc: notification.desc
                })
                .then((dispatch)=>{
                }).catch((err)=>{
                    console.error(err)
                });   
            
    }
}
