import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Course } from '../model/course';
import { catchError, concatMap, last, map, take, tap } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})

export class CreateCourseComponent implements OnInit {

  courseId: string = '';
  percentageChanges$: Observable<number>;
  iconUrl: string = ""

  form = this.fb.group({
    description: new FormControl('', Validators.required),
    longDescription: new FormControl('BEGINNER', Validators.required),
    url: new FormControl(''),
    category: new FormControl('', Validators.required),
    promo: [false],
    promoStartAt: [null]
  });

  constructor(private fb: FormBuilder,
    private coursesService: CoursesService,
    private db: AngularFirestore,
    private router: Router,
    // gives us access to storage for image files for blogs, etc 
    private storage: AngularFireStorage) { }

  ngOnInit() {
    // creates a new ID for us on page init 
    this.courseId = this.db.createId();
  }

  onCreateCourse() {
    // spread operator and as object to assign to variable 
    //const newCourse = { ...this.form.value } as Course;

    // here we use the form value to populate the course object 
    const value = this.form.value;

    const newCourse: Partial<Course> = {
      description: value.description, 
      url: value.url,
      longDescription: value.longDescription,
      promo: value.promo, 
      // as the category is an array we need to appraoch this value differently 
      categories: [value.category] 
    }
    // used to store JS DateTime in Firestore 
    newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);
    console.log(newCourse);
    // our service to create 
    // Partial as it does not contain an id - as hasn't been created yet 
    this.coursesService.createCourse(newCourse, this.courseId).pipe(
      tap(course => {
        console.log("Created new course: ", course);
        this.router.navigateByUrl("/courses");
      }),
      catchError(error => {
        console.log("Error creating course: ", error);
        alert("Could not create the course");
        return throwError(error)
      })
    ).subscribe()
  }

  // file upload 
  onFileChange(event) {
    const file: File = event.target.files[0]; 
    console.log("File", file); 
    // define a path for where the images will be uplaod to 
    const filePath = `courses/${this.courseId}/${file.name}`;
    const task = this.storage.upload(filePath, file, {
      // optional metadata - our headers
      // caches the images in the users client side browser
      // max-age measured in seconds 
      cacheControl: "max-age=31536000,public"
    })
    // upload % 
    this.percentageChanges$ = task.percentageChanges();

    // display the image preview to the user  
    task.snapshotChanges()
      .pipe(
        // only show when file fully uploaded 
        last(),   
        // emits a safe download url for our uplaoded file 
        concatMap(() => this.storage.ref(filePath).getDownloadURL()),
        // save the url to display image to user 
        tap(url => this.iconUrl = url), 
        catchError(error => {
          console.log("Error uploading file: ", error);
          alert("Could not create thumbnailUrl");
          return throwError(error)
        })
        ).subscribe(); 
    
  }

}


