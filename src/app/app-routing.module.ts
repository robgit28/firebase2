import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {LoginComponent} from './login/login.component';
import {CreateCourseComponent} from './create-course/create-course.component';
import {AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import { CourseResolver } from './services/course.resolver';

// our auth pipe function 
// redirectUnauthorizedTo - Firebase auth pipe 
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login'])

// our admin auth pipe function
// hasCustomClaim - Firebase auth pipe 
const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
    // our auth guard 
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'create-course',
    component: CreateCourseComponent, 
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: adminOnly
    }
  },
  {
    path: 'create-user',
    component: CreateUserComponent, 
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: adminOnly
    }
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'courses/:courseUrl',
    component: CourseComponent, 
    resolve: {
      course: CourseResolver
    },
    // our auth guard 
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
