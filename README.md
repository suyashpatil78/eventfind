# eventfind
### An application developed to create and locate an event happening nearby you. This is a cross-platform application built using Ionic and Angular. Several plugins from capacitor have been used to provide native support. Here are certain features of it:
* User can register and login in the application. The authentication is being handled by firebase.
* User can create an event by using 10 points. The device location will be used as a location of the event.
* Users can participate in other events by submitting their photos.
* Events can be located real-time on map section. Stadiamap and leaflet is used for showing map.

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



https://github.com/suyashpatil78/eventfind/assets/127177049/69ae0db4-d7d0-4c48-bef6-110907f0275f

<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/55d07a5c-9afa-4a5d-a5cc-6d3484f2364c" width='260px' height='540px' />
<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/e173e998-2f1a-4650-bca1-ce22ad0b9849" width='260px' height='540px' />
<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/99a702d6-cfde-44d6-bc35-861a6e81fa3a" width='260px' height='540px' />
<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/76ee50a2-7b58-4151-acb6-9b015d10479b" width='260px' height='540px' />
<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/62960038-b7ff-43be-987f-19a715708a63" width='260px' height='540px' />
<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/4539954b-5812-4ee4-8f93-c11d6b3b8ca3" width='260px' height='540px' />
<img src="https://github.com/suyashpatil78/eventfind/assets/127177049/fe9644e6-9100-42dc-8186-b4a7712d8f6c" width='260px' height='540px' />
