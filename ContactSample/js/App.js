import React, { Component } from 'react';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { NativeEventEmitter, NativeModules, Alert } from 'react-native';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
  TextInput
} from 'react-native';

import { VerintButton } from './VerintButton'
import { VerintXM } from 'react-native-verint-xm-sdk'
import { styles } from './styles'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

async function getContactDetails(type, callback) {
  try {
    var details = await VerintXM.getContactDetails(type);
    callback(details)
  } catch (e) {
    console.error(e);
  }
}

class MainScreen extends Component {

  addListener(eventName, emitter) {
    emitter.addListener(
      eventName,
      (event) => {
          console.log("[[" + eventName + "]]");
      });
  }

  constructor(props) {
    super(props);

    const verintEmitter = new NativeEventEmitter(VerintXM.nativeModule);

    // defined in the Verint-XM SDK
    this.addListener('onInvitePresented', verintEmitter);
    this.addListener('onSurveyPresented', verintEmitter);
    this.addListener('onSurveyCompleted', verintEmitter);
    this.addListener('onSurveyCancelledByUser', verintEmitter);
    this.addListener('onSurveyCancelledWithNetworkError', verintEmitter);
    this.addListener('onInviteCompleteWithAccept', verintEmitter);
    this.addListener('onInviteCompleteWithDecline', verintEmitter);
    this.addListener('onInviteNotShownWithEligibilityFailed', verintEmitter);
    this.addListener('onInviteNotShownWithSamplingFailed', verintEmitter);

    // handler for custom invite
    verintEmitter.addListener(
      "shouldShowCustomInvite",
      (data) => {
        // this demonstrates a no-invite custom invite that immediately shows the survey
        VerintXM.customInviteAccepted()
    });
    
    // handler for invalid contact details
    verintEmitter.addListener(
      "shouldSetInvalidInput",
      (data) => {
        alert("Invalid input! Reset state, set contact details, and try again.")
        VerintXM.customInviteDeclined()
    });

    this.state = {
      setCustomInviteEnabled: false
    }
 
    VerintXM.setDebugLogEnabled(true)
    VerintXM.start(config)
    VerintXM.setSkipPoolingCheck(true)
    VerintXM.setPreferredContactType("email")
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'flex-start', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
            <Space />
            <Text style={[styles.text]}>This sample demonstrates the Contact invite type, which delivers survey links via email or SMS. Use the "Set Contact Details" page to pre-set contact details for the invite. The SDK transitions to an idle state after an invite is displayed. Use "Reset State" to test again. (This will also delete pre-set contact details.). Follow the instructions below to check eligibility. Internet connection is required.</Text>
            <Space />
            <Text style={[styles.text]}>Option 1: The app can trigger an invite by launching 3 times. Try exiting the app and re-entering 3 times, then click the "Check Eligibility" button.</Text>
            <Space />
            <Text style={[styles.text]}>Option 2: Significant events can also be used to trigger an invite. Click the "Increment Significant Event" button below a few times, then click the "Check Eligibility" button to trigger an invite.</Text>
            <VerintButton
              title="Check Eligibility"
              onPress={() => { 
                // Launch an invite as a demo
                VerintXM.checkEligibility() }} />
            <VerintButton
              title="Increment Significant Event"
              onPress={() => { 
                // Increment the significant event count so that we're eligible for an invite
                // based on the criteria in the config
                VerintXM.incrementSignificantEvent("instant_invite")}} />
            <VerintButton
              title="Set Contact Details"
              onPress={() => { this.props.navigation.navigate('SetContactDetails'); }} />
            <VerintButton
              title="Reset State"
              onPress={() => { VerintXM.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
            <VerintButton
              title={`Skip invite using custom invites (${this.state.setCustomInviteEnabled})`}
              onPress={() => {
                let enabled = !this.state.setCustomInviteEnabled
                VerintXM.setCustomInviteEnabled(enabled, 'CONTACT')
                this.setState({setCustomInviteEnabled: enabled})
              }} />
            <Space />
            <Text style={[styles.text]}>When enabled the survey will be displayed immediately using a custom invite that skips the UI and immediately accepts the invite.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

class SetContactDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state={
      email: "",
      phone: ""
    }

    getContactDetails("email", (details) => { this.setState({email: details}) })
    getContactDetails("phone", (details) => { this.setState({phone: details}) })
  }
 
  render() {
    return(
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'flex-start', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />
          <Space />
          <Text style={[styles.text]}>Email Address:</Text>
          <Space />
          <TextInput
            style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => this.setState( {email: text} )}
            value={this.state.email}
          />
          <Space />
          <Text style={[styles.text]}>Phone Number:</Text>
          <Space />
          <TextInput
            style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => this.setState( {phone: text} )}
            value={this.state.phone}
          />
          <Space />
          <VerintButton
              title="Save"
              style={{ width: 200, height: 40 }}
              onPress={() => { 
              VerintXM.setContactDetails(`${this.state.email}`, "email");
              VerintXM.setContactDetails(`${this.state.phone}`, "phone");
              } 
          } />
        </ScrollView>
    </SafeAreaView>
    );
  }
}

const config = {
    "repeatDaysAfterDecline":5,
    "repeatDaysAfterComplete":5,
    "repeatDaysAfterAccept":3,
    "notificationType":"CONTACT",
    "cppParameters": {
        "sample_app":"Contact Survey 2.0"
    },
    "invite": {
        "logo": "verint_logo",
        "baseColor": [43, 101, 242],
    },
    "survey": {
        "closeButtonColor": [255, 255, 255],
        "closeButtonBackgroundColor": [12, 12, 12],
        "headerColor": [43, 101, 242],
    },
    "surveyManagement": {
          "surveys": [
              {
                  "campaignId": "0",
                  "groupId": "1885224709",
                  "projectId": "1069037906",
                  "url": "https://survey.vovici.com",
                  "name": "SampleSurvey",
                  "launchCount": 3,
                  "significantEventThresholds": {
                      "instant_invite":3
                  }
              }
          ]
      }
}

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
  Main: {
    navigationOptions: {
      title: "Contact Invite Sample"
    },
    screen: MainScreen
  },
  SetContactDetails: {
    navigationOptions: {
      title: "Set Contact Details"
    },
    screen: SetContactDetailsScreen
  }
});

const AppContainer = createAppContainer(AppNavigator);
