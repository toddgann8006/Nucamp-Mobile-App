import React, { Component } from "react";
import { ScrollView, View, Image, StyleSheet, Linking, TouchableOpacity, Modal, TextInput, Button, Alert, SafeAreaView } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import InputValidation from 'react-native-input-validation';
import { postEmail, resEmail, fetchNewuser, postUser, fetchRewards, toggleModalOff, toggleModalOn } from '../redux/ActionCreators';

const mapStatetoProps = state => {
    return {
        email: state.email,
        newuser: state.newuser,
        modal: state.modal
    };
};

const mapDispatchToProps = {
    postEmail: (email) => (postEmail(email)),
    resEmail: () => (resEmail()),
    postUser: (email) => (postUser(email)),
    fetchNewuser: () => (fetchNewuser()),
    fetchRewards: () => (fetchRewards()),
    toggleModalOff: () => (toggleModalOff())
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        }
    }

    componentDidMount() {
        this.props.fetchNewuser();
        this.props.fetchRewards();
        this.checkPermission();
        PushNotification.createChannel(
            {
                channelId: "default-channel-id", // (required)
                channelName: `Default channel`, // (required)
                channelDescription: "A default channel", // (optional) default: undefined.
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {

                console.log('NotificationHandler:', notification);

                // (required) Called when a remote is received or opened, or local notification is opened
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);

                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            senderID: '117377770548',

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });
    };

    componentDidUpdate(prevProps) {
        if (this.props.email !== prevProps.email) {
            this.props.fetchNewuser();
            this.props.fetchRewards();
        }
    }

    checkPermission = async () => {
        const enabled = await messaging().hasPermission();
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    }

    getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log(fcmToken);
            this.showAlert('Your Firebase Token is:', fcmToken);
        } else {
            this.showAlert('Failed', 'No token received');
        }
    }

    requestPermission = async () => {
        try {
            await messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
        }
    }

    handleNewuser() {
        const email = this.state.email.toLowerCase()
        this.props.toggleModalOff();
        this.props.postUser(email);
    }

    handleEmail() {
        const { email } = this.state
        this.props.postEmail(email.toLowerCase());
    }

    resetEmail() {
        this.setState({ email: "" })
        this.props.resEmail();
    }

    render() {
        return (
            <ScrollView style={styles.container}
                keyboardShouldPersistTaps='handled'
            >
                <Image
                    source={require('./images/logo.png')}
                    resizeMode='contain'
                    style={styles.image} />
                <Text
                    style={{ fontSize: 25, color: 'white', textAlign: 'center' }}
                >
                    located inside Nourish Skin Studio
                </Text>
                <Text style={styles.address}>
                    110 Westfield Road Suite 1
                </Text>
                <Text style={styles.address}>
                    Knoxville, TN 37919
                </Text>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('./images/headshot.jpg')}
                        style={styles.headshot}
                    />
                </View>
                <Text style={styles.lmt}>
                    Shannon Cox, Licensed Massage Therapist
                </Text>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('mailto:shannoncox@massageknox.com')}
                        style={styles.button}
                    >
                        <Text>Email</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.covid}>
                    <Text>
                        Due to Covid 19 the lobby is closed and we are open by appointment only.
                    </Text>
                    <Text>
                        Upon arrival, please wait in your vehicle.
                    </Text>
                </Text>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://www.facebook.com/massageknox/?ref=py_c')}
                        style={styles.button}
                    >
                        <Text>Find Me On Facebook</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 100 }}>
                    <Text
                        style={{ fontSize: 20, color: 'yellow', marginTop: 25, marginLeft: 30 }}>
                        Hours of availability:
                    </Text>
                    <Text style={styles.hours}>
                        Tuesday: 10-2
                    </Text>
                    <Text style={styles.hours}>
                        Wednesday: 10-5
                    </Text>
                    <Text style={styles.hours}>
                        Thursday: 10-6
                    </Text>
                    <Text style={styles.hours}>
                        Friday: 10-6
                    </Text>
                    <Text style={styles.hours}>
                        Saturday: 10-6
                    </Text>
                </View>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.props.modal.showModal}
                >
                    <SafeAreaView style={styles.modal}>
                        <Text>Thanks for downloading the app. Please enter your email to start receiving rewards.</Text>
                        <InputValidation
                            textInputContainerStyle={styles.modalTextinput}
                            validator="email"
                            value={this.state.email}
                            onChangeText={(email) =>
                                this.setState({ email: email })
                            }
                            ref={input => { this.textInput = input }}
                            returnKeyType="go"
                        />
                        <Button
                            onPress={() => {
                                this.handleEmail()
                                Alert.alert(
                                    `Is ${this.state.email} the correct email?`,
                                    "Click Ok to continue or Cancel to enter a different email.",
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => this.handleNewuser()
                                        },
                                        {
                                            text: 'Cancel',
                                            onPress: () => this.resetEmail()
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }}
                            color='#5637DD'
                            title='Register'
                        />
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        marginTop: 0,
        paddingBottom: 50
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    headshot: {
        width: '50%',
        height: undefined,
        aspectRatio: 1,
        marginTop: 50
    },
    address: {
        color: 'white',
        textAlign: 'center',
        marginTop: 25,
        fontSize: 15
    },
    hours: {
        color: 'yellow',
        marginTop: 25,
        marginLeft: 30,
        fontSize: 15
    },
    button: {
        backgroundColor: 'yellow',
        color: 'black',
        width: '50%',
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    lmt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        marginTop: 10
    },
    covid: {
        color: 'white',
        fontSize: 15,
        marginVertical: 30
    },
    modal: {
        position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTextinput: {
        fontSize: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        marginTop: 30,
        marginBottom: 50,
        width: 350,
        height: 50
    }
})

export default connect(mapStatetoProps, mapDispatchToProps)(Home);

// settings.gradle

include ':react-native-push-notification'
project(':react-native-push-notification').projectDir = file('../node_modules/react-native-push-notification/android')

// build.gradle

buildscript {
    ext {
        buildToolsVersion = "29.0.3"
        minSdkVersion = 21
        compileSdkVersion = 30
        targetSdkVersion = 30
        googlePlayServicesVersion = "+"
        firebaseVersion = "+"
        firebaseMessagingVersion = "+"
    }

    // app/build.gradle

    apply plugin: 'com.google.gms.google-services'

    implementation platform('com.google.firebase:firebase-bom:29.0.4')
    implementation 'com.google.firebase:firebase-analytics:17.3.0'
    implementation project(':react-native-push-notification')

        //AndroidManifest.xml


        < meta - data  android: name = "com.dieam.reactnativepushnotification.notification_foreground"
    android: value = "true" />
        < meta-data  android:name = "com.dieam.reactnativepushnotification.notification_color"
    android:resource = "@color/white" /> < !--or @android: color / { name } to use a standard color-- >

    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationActions" />
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver">
      <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
        <action android:name="android.intent.action.QUICKBOOT_POWERON" />
        <action android:name="com.htc.intent.action.QUICKBOOT_POWERON"/>
      </intent-filter>
      </receiver>
      <service
        android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService"
        android:exported="false" >
      <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
      </intent-filter>
    </service>

    // MainApplication.java

    import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;