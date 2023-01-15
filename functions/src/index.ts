import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

// function naming should be the event we are responsible to + the purpose of the function
// functions.firestore - indicates a DB trigger 
export const onAddCourseUpdatePromoCounter = functions
    // run time requirements for the function, max timeout & max function size 
    .runWith({ 
        timeoutSeconds: 60, memory: "1GB" 
    })
    // functions.firestore.document - indicates a document trigger / type of event 
    // document("courses/{courseId}") - then pass in the path to the document 
    .firestore.document("courses/{courseId}")
    // onCreate - the event we want to detect, also available are onUpdate, onDelete, onWrite 
    // onCreate takes 2 arguments - snap (the data we are inserting, the document) & context (represents the path variables we are creating on the DB) 
    .onCreate(async (snap, context) => {
    // add logging
        functions.logger.debug(`Running onAddCourse trigger for courseId: ${context.params.courseId} `);

        // const course = snap.data();
        // const promoId = course.promoId;
        // const promoRef = admin.firestore().collection("promos").doc(promoId);
        // const promoSnap = await promoRef.get();
        // const promo = promoSnap.data();
        // const newCount = promo.count + 1;
        // return promoRef.update({ count: newCount });
    }); 
