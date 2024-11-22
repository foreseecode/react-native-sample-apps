
import React, { Component } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
  PermissionsAndroid,
} from 'react-native';

import { VerintButton } from './VerintButton'
import { styles } from './styles'
import { VerintXM } from 'react-native-verint-xm-sdk'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

const requestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
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

    // startup listeners
    this.addListener('onStarted', verintEmitter);
    this.addListener('onStartedWithError', verintEmitter);
    this.addListener('onFailedToStartWithError', verintEmitter);

    // invite/survey lifecycle listeners
    this.addListener('onInvitePresented', verintEmitter);
    this.addListener('onSurveyPresented', verintEmitter);
    this.addListener('onSurveyCompleted', verintEmitter);
    this.addListener('onSurveyCancelledByUser', verintEmitter);
    this.addListener('onSurveyCancelledWithNetworkError', verintEmitter);
    this.addListener('onInviteCompleteWithAccept', verintEmitter);
    this.addListener('onInviteCompleteWithDecline', verintEmitter);
    this.addListener('onInviteNotShownWithEligibilityFailed', verintEmitter);
    this.addListener('onInviteNotShownWithSamplingFailed', verintEmitter);

    this.state = {
    }

    if (Platform.OS === 'android') {
      requestNotificationPermission();
    }
 
    VerintXM.setDebugLogEnabled(true)
    VerintXM.startWithSiteKey("mobsdk-react-localnotification-sample")
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
            <Text style={[styles.text]}>This sample demonstrates the Exit Invite type, which denotes that the invitation appears as a local notification that appears after the app is exited. Follow the instructions below to check eligibility.</Text>
            <Space />
            <Text style={[styles.text]}>This application is using the launch count criteria. This criteria increments each time the app is backgrounded and refocused. The threshold for the launch count criteria is set to 3. Once the launch count criteria reaches 3, you can use check eligibility to trigger an invitation. After checking eligibility, background the app. A local notification should arrive after a few seconds.</Text>
            <VerintButton
              title="Check Eligibility"
              onPress={() => { 
                // Launch an invite as a demo
                VerintXM.checkEligibility() }} />
            <VerintButton
              title="Reset State"
              onPress={() => { VerintXM.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invitation local notification is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default App;
