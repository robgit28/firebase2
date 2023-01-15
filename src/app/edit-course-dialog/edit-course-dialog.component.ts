import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { CoursesService } from '../services/courses.service';


@Component({
    selector: 'edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {

    form: FormGroup;
    course: Course; 

    constructor(
        private dialogRef: MatDialogRef<EditCourseDialogComponent>, 
        private fb: FormBuilder, 
        // inject the course data into the dialog from the course card list component 
        @Inject(MAT_DIALOG_DATA) course: Course, 
        private coursesService: CoursesService
    ) { 
        this.course = course; 
        // needs to be initialized with the values from the course we want to update 
        this.form = fb.group({
            description: [course.description, Validators.required],
            longDescription: [course.longDescription, Validators.required],
            //category: [course.categories, Validators.required],
            promo: [course.promo]
        });
    }

    close() {
        this.dialogRef.close();  
    }

    save() {
        const changes = this.form.value; 
        console.log(changes); 
        console.log(this.course) ; 
        this.coursesService.updateCourse(this.course.id, changes)
            .subscribe(() => { 
                this.dialogRef.close(changes);
            });

    }
}






