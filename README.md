![Build status](http://ci.signal.boundlessgeo.com:8080/job/spatialconnect-mobile%20%28Develop%29/badge/icon)

### Running apps locally for development

To start the Android app, first you need to start an emulator.  Then you
can run

```
react-native run-android
```

To run the iOS app, run

```
react-native run-ios
```

### Signing apps

First you will need to obtain the signing key file and passwords from one of the project
leaders.  Email spatialconnect@boundlessgeo.com to request it.

#### Signing the Android app

To generate a signed APK, you need to change to the
`android` directory and run

```
./gradlew assembleRelease
```

Then you can find the distributable app at
`android/app/build/outputs/apk/app-release.apk`.

If you want to install this signed apk to your local device to test, run

```
./gradlew installRelease
```


Copy files from sync for firebase messaging:
cp ~/Sync/firebase-messaging/GoogleService-Info.plist ios/SCMobile/
cp ~/Sync/firebase-messaging/google-services.json android/app/
