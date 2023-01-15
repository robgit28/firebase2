import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRoles } from '../model/user-roles';

@Injectable({ 
    providedIn: 'root'
})

export class UserService {
    isLoggedIn$: Observable<boolean>
    isLoggedOut$: Observable<boolean>
    pictureUrl$: Observable<string>
    roles$: Observable<UserRoles>

    // gives us access to the JWT about the user 
    constructor(private afAuth: AngularFireAuth, 
                private router: Router) {
        // the jwt 
        afAuth.idToken.subscribe(jwt => console.log("jwt: ", jwt)); 
        // all the user information 
        afAuth.authState.subscribe(auth => console.log("auth: ", auth));
        this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));
        this.pictureUrl$ = this.afAuth.authState.pipe(map(user => user? user.photoURL : null));

        // user custiom claims roles 
        // idTokenResult = object - payload of jwt
        this.roles$ = this.afAuth.idTokenResult
          .pipe(
            // if no custom claims on user then make then a non admin 
            map(
              token => <any>token?.claims ?? {admin: false}
            )
          )


    }  


    logout() {
        this.afAuth.signOut();
        this.router.navigateByUrl('/login');
    }

}
