## react-native-sample-apps

## Authenticating with the package repository (Android)

You will need to authenticate with GitHub Packages to download our native Android library.
To do so, you'll need a personal key which can be generated from your GitHub account by following the [instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token). 
The token will need the `read:packages` permission.

Once you have that key, you should set two environment variables on your machine: `GITHUB_USERNAME` for your username, and `GITHUB_PERSONAL_KEY` for your personal key.
Those environment variables will be picked up by the following lines in the each sample project's `/build.gradle` file:

```
allprojects {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/foreseecode/public-packages")
            credentials {
                username = System.getenv("GITHUB_USERNAME")
                password = System.getenv("GITHUB_PERSONAL_KEY")
            }
        }
    }
}
```

See [Getting Started guide](https://connect.verint.com/developers/xmsdk/w/mobilesdk/39087/get-started-with-the-verint-xm-react-native-sdk) for more information.

## Prerequisites

Make sure React Native and required Environment configured on your machine. 
See: https://reactnative.dev/docs/environment-setup

## Installing

Clone this repo:

    $ git clone https://github.com/foreseecode/react-native-sample-apps.git

Once it's done, you will find 3 project folders:
  
    InSessionSample
    ContactSample
    LocalNotificationSample

In each project folder, run
  
    $ npm install
    $ cd ios
    $ pod install

To start a project, run
    
    $ npx react-native run-ios
    or..
    $ npx react-native run-android

## Projects

## InSessionSample
This sample project demonstrates a basic implementation of the Verint-XM Predictive In-Session Invite code in an empty app.
It uses a native view to show a modal dialog to the user inviting them to take a survey when they have met the 
configured threshold.

## ContactInvitationSample

This example shows how to provide a user's contact information to the SDK for use in a CONTACT mode survey.

## LocalNotificationSample

This sample project demonstrates a local notification invite. Accept the invite and then close the application. 
You will receive a local notification linking the survey.
