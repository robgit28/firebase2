import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditCourseDialogComponent} from "../edit-course-dialog/edit-course-dialog.component";
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    @Output()
    courseEdited = new EventEmitter();

    @Output()
    courseDeleted = new EventEmitter<Course>();

    constructor(
      private dialog: MatDialog,
      private router: Router, 
      private coursesService: CoursesService, 
      // public as used in template
      public userService: UserService) {
    }

    ngOnInit() {

    }

    editCourse(course:Course) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";

        dialogConfig.data = course;

        this.dialog.open(EditCourseDialogComponent, dialogConfig)
        // after closing dialog see if any data has changed and emits it 
            .afterClosed()
            .subscribe(val => {
                if (val) {
                    // emits to home component 
                    this.courseEdited.emit();
                }
            });

    }

    // only deletes the document and not any nested colections 
    deleteCourse(course: Course) {
        // just for deleting document and not nested collections 
        // this.coursesService.deleteCourse(course.id)
        // for deleting document and nested collections 
        this.coursesService.deleteCourseAndLessons(course.id)
            .pipe(
                tap(() => { 
                    console.log("Course deleted", course);
                    // emits to home component to update the list
                    return this.courseDeleted.emit(course); 
                }),
                catchError(err => {
                    console.log("Error deleting course", err);
                    alert("Course deletion failed");
                    return throwError(err);
                })
            ).subscribe(() => {
            })


    }

}









