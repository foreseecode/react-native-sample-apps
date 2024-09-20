
import React, { Component } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
} from 'react-native';

import { VerintButton } from './VerintButton'
import { styles } from './styles'
import { VerintXM } from 'react-native-verint-xm-sdk'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

class App extends Component {

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

    // handle for custom invite
    verintEmitter.addListener(
      "shouldShowCustomInvite",
      (data) => {
        // this demonstrates a no-invite custom invite that immediately shows the survey
        VerintXM.customInviteAccepted();
    });

    this.state = {
      setCustomInviteEnabled: false
    }
 
    VerintXM.setDebugLogEnabled(true)
    VerintXM.start(config)
    VerintXM.setSkipPoolingCheck(true)
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
            <Space />
            <Text style={[styles.text]}>This sample demonstrates the In Session type, which denotes that the survey is presented at the point where the user accepts the invitation. Follow the instructions below to check eligibility.</Text>
            <Space />
            <Text style={[styles.text]}>This app is using the significant event criteria. This criteria increments each time when the "Check Eligibility" button is clicked. The threshold for the significant event criteria is set to 1.</Text>
            <VerintButton
              title="Check Eligibility"
              onPress={() => { 
                // Increment the significant event count so that we're eligible for an invite
                // based on the criteria in config
                VerintXM.incrementSignificantEvent("instant_invite")
                
                // Launch an invite as a demo
                VerintXM.checkEligibility() }} />
            <VerintButton
              title="Reset State"
              onPress={() => { VerintXM.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
            <VerintButton
              title={`Skip invite using custom invites (${this.state.setCustomInviteEnabled})`}
              onPress={() => {
                let enabled = !this.state.setCustomInviteEnabled
                VerintXM.setCustomInviteEnabled(enabled)
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

const config = {
    "notificationType": "IN_SESSION",
    "cppParameters": {
        "sample_app":"In Session Sample CPP"
    },
    "invite": {
        "logo": "verint_logo",
        "baseColor": [43, 101, 242]
    },
    "survey": {
        "closeButtonColor": [255, 255, 255],
        "closeButtonBackgroundColor": [12, 12, 12],
        "headerColor": [43, 101, 242]
    },
    "surveyManagement": {
    "surveys": [
        {
            "url": "https://survey.vovici.com/se/705E3F053FB8395201",
            "name": "SampleSurvey",
            "presentationMode": "MODAL",
            "significantEventThresholds": {
                "instant_invite":1
            }
        }
    ]
  }
}

export default App;
