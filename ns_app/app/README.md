# Stepper Motor Project (Mac)
### Prerequisites
* Install Node LTS
  * `brew install nvm`
  * `nvm install 6`
  * `nvm use 6`
* Install Android and/or iOS SDK's using nativescript install script
  * `ruby -e "$(curl -fsSL https://www.nativescript.org/setup/mac)"`
* Install Android Studio and/or Xcode
* Open & accept licenses for Android Studio/Xcode
* Xcode/iOS development needs an apple developer account with provisioning profiles downloaded locally and set up in Xcode
* Install NativeScript globally
  * `npm install -g nativescript`
  * make sure `tns doctor` says `No issues were detected.`

### Clone the repository
* `git clone https://github.com/ejsuncy/steppermotor.git`
* `cd steppermotor`


### NativeScript app setup
* Use the ns app directory as the working directory
  * `cd ns_app`
* Add iOS and/or Android platforms
  * `tns platform add ios`
  * `tns platform add android`

### NativeScript app usage
* Run the app on the emulator
  * `tns run ios --emulator`
* Or run the app on the only connected device (or emulator if none connected)
  * `tns run ios`
* Or specify which device to run it on
  * `tns run ios --device 1`


