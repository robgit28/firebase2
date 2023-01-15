import { Component, OnInit } from '@angular/core';


import 'firebase/firestore';

import { AngularFirestore } from '@angular/fire/firestore';
import { COURSES, findLessonsForCourse } from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    // AngularFirestore is a service that allows us to interact with Firestore Database
    constructor(
        private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = { ...data };
        delete newData.id;
        return newData;
    }

    onReadDoc() {
        // allows us to access the doc in our collection in Firestore DB
        // get method gives us an observable
        this.db.doc('/courses/2jXpkPiB5F7abVe30LAd').get()
        // gives us a document snapshot
            .subscribe(snap => {
                // snap.id gives us the id of the document 
                // snap.data() - method gives us the data of the document
                console.log(snap.id); 
                console.log(snap.data()); 
            });
    }

    onReadCollection() {
        // allows us to access the collection in our collection in Firestore DB
        // we can pass in a second argument to the get method to specify the query
        this.db.collection('courses', 
        // target a specific field, operator and then value 
        // orderBy method allows us to sort the data
        // we can use use two where's when we create a composite index through the Firebase Browser Console
            ref => ref.where('seqNo', '<=', 20)
                .where('url', '==', 'angular-forms-course')
                .orderBy('seqNo')
        ).get().subscribe(snaps => {
            // loop through the document snapshots
            snaps.forEach(snap => {
                // will give us all of the documents in that collection 
                console.log(snap.id);
                console.log(snap.data());
            })
        });
    }

    // collection group query
    onReadCollectionGroup() {
        this.db.collectionGroup('lessons', 
            ref => ref.where('seqNo', '==', 1)
        ).get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            })
        });
    }

    // stays open so we need to unsusbscribe from it
    onReadDocRealtime() {
        // allows us to access the doc in realtime when any changes are made to it 
        // snapshotChanges method gives us an observable
        this.db.doc('/courses/2jXpkPiB5F7abVe30LAd').snapshotChanges()
        // gives us a document snapshot
            .subscribe(snap => {
                // we now need to access the payload to retrieve the id & data 
                console.log(snap.payload.id); 
                console.log(snap.payload.data()); 
            });
    }

    // stays open so we need to unsusbscribe from it 
    onReadDocValueChanges() {
        // allows us to access the doc in realtime when any changes are made to it 
        // valueChanges method gives us the actual document with no id 
        this.db.doc('/courses/2jXpkPiB5F7abVe30LAd').valueChanges()
        // gives us the actual course
            .subscribe(course => {
                // course will be the qactual document 
                console.log(course); 
            });
    }


}
















