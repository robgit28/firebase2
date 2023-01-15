// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // see app.module.ts 
  useEmulators: true,
  firebase: {
    apiKey: "AIzaSyCLxWqzf-7bUyQjNQqlXHbrR-Rn1ARlb30",
    authDomain: "fir-course-2-755f5.firebaseapp.com",
    projectId: "fir-course-2-755f5",
    storageBucket: "fir-course-2-755f5.appspot.com",
    messagingSenderId: "545514302792",
    appId: "1:545514302792:web:4ec9ec4b5d4db97494977d"
  },
  api: {

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
