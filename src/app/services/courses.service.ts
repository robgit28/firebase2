import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
// from "@google-cloud/firestore";
import { from, Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { convertSnaps } from "./db-utils";
import firebase from 'firebase/app';
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
    providedIn: "root"
})

export class CoursesService {

    constructor(private db: AngularFirestore) {
    }

    loadCoursesByCategory(category: string): Observable<Course[]> {
        return this.db
            .collection('courses',
                ref => ref.where('categories', 'array-contains', category)
                    .orderBy('seqNo')
            ).get()
            .pipe(
                // see db-utils.ts for reference of convertSnaps()
                // keeps it generic and cuts down on copy paste code 
                map(result => convertSnaps<Course>(result))
            );
    }

    findAllCourses(): Observable<Course[]> {
        return this.db
            .collection('courses')
            .snapshotChanges()
            .pipe(
                map(snaps => snaps.map(snap => {
                    const data = snap.payload.doc.data() as Course;
                    const id = snap.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    // will only return one entity 
    // return null if url isn't there, maybe typo by user  
    findCourseByUrl(courseUrl: string): Observable<Course | null> {
        console.log("courseUrl", courseUrl); 
        return this.db
            .collection('courses', 
                ref => ref.where('url', '==', courseUrl))
            .get()
            .pipe(
                map(results => {
                    // will be an array of 1 or 0 
                    const courses = convertSnaps<Course>(results); 
                    console.log("Courses Array: ", courses); 
                    return courses.length == 1 ? courses[0] : null; 
                })
            );
    }

    // courseId created client side and is optional 
    // creating courseId on client side makes it easier to save an image to the document 
    // how to allocate the courseId? 
    // use Partial<Course> ase we don't have the full details yet, such as the courseId 
    createCourse(newCourse: Partial<Course>, courseId?: string) {
        return this.db.collection('courses',
            // retrieve the highest seqNo course 
            ref => ref.orderBy('seqNo', 'desc').limit(1))
            .get()
            .pipe(
                // ideal for save operations 
                concatMap(result => {
                    // create a new observable to insert the course on the DB 
                    // courses will be an array but will only have 0 or 1 element 
                    const courses = convertSnaps<Course>(result);
                    const lastCourseSeqNo = courses.length > 0 ? courses[0].seqNo : 0;
                    // add 1 to the highest seqNo course so it's noow the highest / most recent / latest 
                    const course = {
                        // create a shallow copy of the newCourse we are passign in / creating 
                        ...newCourse,
                        seqNo: lastCourseSeqNo + 1
                    }
                    // now create courseId or use courseId that has been passed in 
                    // the insertion into the DB 
                    let save$: Observable<any>;
                    if (courseId) {
                        // overwirte anything nexisitng in this pass with the new course data
                        // from operator creates an observable 
                        save$ = from(this.db.doc(`courses/${courseId}`).set(course));
                    } else {
                        // will create an id on the DB automatically 
                        save$ = from(this.db.collection('courses').add(course));
                    }

                    return save$
                        .pipe(
                            map(result => {
                                return {
                                    // returns an observable of the course that was just inserted into the DB 
                                    id: courseId ? courseId : result.id,
                                    ...course
                                }
                            })
                        );
                })
            )
    }

    // return Observable to see if opeation weas successful or not 
    updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        console.log("courseId: ",  courseId); 
        // from converts promise to observable 
        return from(this.db.doc(`courses/${courseId}`).update(changes));
    }

    // not being used     
    saveCourse(courseId: string, course: Course): Observable<any> {
        // from converts promise to observable 
        return from(this.db.doc(`courses/${courseId}`).set(course));
    }

    // only deletes the document and not any collections nested in it 
    deleteCourse(courseId: string): Observable<any> {
        // from converts promise to observable 
        return from(this.db.doc(`courses/${courseId}`).delete());
    }

    // deletes the document and any collections nested in it 
    deleteCourseAndLessons(courseId: string): Observable<any> { 
        return this.db.collection(`courses/${courseId}/lessons`)
        .get()
        .pipe(
            concatMap(results => {
                const lessons = convertSnaps<Lesson>(results)
                
                // creates a batch write 
                // batch writes are atomic 
                const batch = this.db.firestore.batch();
                // a firestore clientside reference to the document 
                const courseRef = this.db.doc(`courses/${courseId}`).ref;
                console.log("courseRef: ", courseRef); 
                batch.delete(courseRef);

                // loop through lessons and delete each lesson 
                for (let lesson of lessons) {
                    const lessonRef = this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;
                    console.log("lessonRef: ", lessonRef); 
                    batch.delete(lessonRef);
                }
                // returns a promise so convert to observable with from 
                return from(batch.commit());
            })
        )
    }

    // sortOrder, pageNumber, pageSize allows for pagination 
    // find lessons of a given course
    findLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<Lesson[]> {
        return this.db
            .collection(`courses/${courseId}/lessons`,
                ref => ref.orderBy('seqNo', sortOrder)
                    .limit(pageSize)
                    .startAfter(pageSize * pageNumber)
            )
            .get()
            .pipe(
                map(results => convertSnaps<Lesson>(results))
            );
    }

    // does this work? 
    findAllCourseLessons(courseId: string): Observable<Lesson[]> {
        return this.db
            .collection(`courses/${courseId}/lessons`,
                ref => ref.orderBy('seqNo'))
            .get()
            .pipe(
                map(results => convertSnaps<Lesson>(results))
            );
    }


}
