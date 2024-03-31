# eventfind
### An application developed to create and locate an event happening nearby you. This is a cross-platform application built using Ionic and Angular. Several plugins from capacitor have been used to provide native support. Here are certain features of it:
* User can register and login in the application. The authentication is being handled by firebase.
* User can create an event by using 10 points. The device location will be used as a location of the event.
* Users can participate in other events by submitting their photos.
* Events can be located real-time on map section. Stadiamap and leaflet is used for showing map.

## APK - [Release APK](https://github.com/suyashpatil78/eventfind/releases/tag/v1.0)

## Technologies Used
* Ionic v7
* Angular v16
* Capacitor plugins like Camera and Geolocation
* Firebase

## How to setup the project
* Clone the repository and run `npm install`
* Install Ionic CLI by using the command `npm i -g @ionic/cli`
* Create a `environment.development.ts` file in environments folder and replace the template in `environment.ts` by firebase config. To get the config, you need to create a project in the firebase.
* Run command `ionic serve -c development` to run the app on browser.
* To run the app on android emulator, install android studio and necessary SDK and packages.
* Run `ionic build`
* Run `npx cap add android`
* Run `npx cap copy`
* Run `npx cap sync` and then run `ionic cap run android`, select an emulator and run the app.


<img width="385" alt="Screenshot 2024-03-25 at 5 18 11 PM" src="https://github.com/suyashpatil78/eventfind/assets/127177049/a646dd09-4082-4e6d-9718-93b2d39698a1">
<img width="385" alt="Screenshot 2024-03-25 at 5 18 58 PM" src="https://github.com/suyashpatil78/eventfind/assets/127177049/2a7d3593-c5bc-46e6-8cbf-f23c58421d2e">
<img width="385" alt="Screenshot 2024-03-25 at 5 19 20 PM" src="https://github.com/suyashpatil78/eventfind/assets/127177049/2e81197b-aec3-423a-8396-3c70c983961b">
<img width="385" alt="Screenshot 2024-03-25 at 5 19 45 PM" src="https://github.com/suyashpatil78/eventfind/assets/127177049/cb44e160-76d4-43d4-85aa-627575b06918">
<img width="385" alt="Screenshot 2024-03-25 at 5 20 38 PM" src="https://github.com/suyashpatil78/eventfind/assets/127177049/af091837-0a79-4ca4-80b6-daffefafd1e0">

