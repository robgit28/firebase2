// our router resolver
// fetches our course data ahead of the route resolving so we have our data ready before the page laods 
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

@Injectable({
    providedIn: 'root'
})

// Resolve<> interface transforms our service into a Resolver
// we pass in the data that the Resolver is fetching from the DB 
// allows us to navigate to the page of our course - will be needed for blog & job posts 
export class CourseResolver implements Resolve<Course>{
    constructor(private coursesService: CoursesService
        ) { }

        // need to determine which course to load from the DB based on the URL of the page we are on 
        // each course in our DB has a URL property associated with it 
        // paramMap - route path params 
        // "CourseUrl" defined in our Router module under its component 
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        const courseUrl = route.paramMap.get('courseUrl');
        return this.coursesService.findCourseByUrl(courseUrl);
    }
}