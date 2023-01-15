import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    // our firebaseui instance 
    ui: firebaseui.auth.AuthUI;

    // AngularFireAuth service gives all the SDK capabilites fir Authentication 
    // the firebase sdk must be fully intiialised before using the firebaseui
    constructor(private afAuth: AngularFireAuth,
        private router: Router) {
    }

    ngOnInit() {
        // initialises the firebase sdk
        // we have to configure what login options we offer and what happens when the user logins first
        this.afAuth.app.then(app => {
            // available log in options 
            const uiConfig = {
                // user can log in with email & password or Google 
                signInOptions: [
                    EmailAuthProvider.PROVIDER_ID,
                    GoogleAuthProvider.PROVIDER_ID
                ], 
                // what happens when log in is successful
                callbacks: {
                    signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
                }
            }; 
            // initialise the firebaseui instance
            // passes in the firebase authentication service - auth() that firebase ui will use 
            this.ui =  new firebaseui.auth.AuthUI(app.auth());
            // bootstrap it 
            this.ui.start("#firebaseui-auth-container", uiConfig);
            // disable auto sign in for returning users - probably not needed for our app 
            this.ui.disableAutoSignIn();
        })
    }

    onLoginSuccessful(result) {
        console.log("Firebase UI result: ", result); 
        // navigate user back to home page on successsful log in 
        this.router.navigate(['/courses']);
    }

    ngOnDestroy() {
        // destroys the firebase ui instance to prevent memory leaks 
        this.ui.delete(); 
    }
}





