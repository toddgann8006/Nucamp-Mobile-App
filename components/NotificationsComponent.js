import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import PushNotification from "react-native-push-notification";

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
    }

    componentDidMount() {
        this.getNotifications();
    }

    componentDidUpdate(prevState) {
        if (this.state.notifications !== prevState.notifications) {
            this.getNotifications();
        }
    }

    getNotifications() {
        PushNotification.getDeliveredNotifications((all) => {
            console.log(all, "notifications list");
            this.setState({ notifications: all })
        })
    }

    deleteNotifications() {
        PushNotification.removeAllDeliveredNotifications();
        this.setState({ notifications: [] })
    }

    render() {
        console.log(this.state.notifications)
        const notif = this.state.notifications.map((notif, i) => {
            return (
                <View style={styles.notificationsContainer}>
                    <Text
                        style={styles.notificationsText}
                        key={i}>
                        {notif.date = new Date().toLocaleDateString('en-US')}
                        {" "}
                        {notif.body}
                    </Text>
                </View>
            )
        })
        if (notif.length === 0) {
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>
                            Notifications
                        </Text>
                    </View>
                    <View style={styles.notificationsContainer}>
                        <Text style={styles.notificationsText}>No New Notifications</Text>
                    </View>
                </ScrollView>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>
                        Notifications
                    </Text>
                </View>
                {notif}
                <View style={styles.registerView}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            Alert.alert(
                                `Are you sure you want to delete all Notifications?`,
                                "Click Ok to continue or Cancel to go back.",
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => this.deleteNotifications()
                                    },
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancelled')
                                    }
                                ],
                                { cancelable: true }
                            );
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Delete Notifications
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        backgroundColor: 'rgb(38,32,0)'
    },
    header: {
        fontSize: 40,
        color: 'yellow',
        marginTop: 30
    },
    headerContainer: {
        backgroundColor: 'black',
        alignItems: 'center',
        marginBottom: 20
    },
    notificationsText: {
        fontSize: 20,
        color: 'yellow'
    },
    notificationsContainer: {
        backgroundColor: 'black',
        borderStyle: 'solid',
        paddingVertical: '5%',
        borderStyle: 'solid',
        borderColor: 'yellow',
        borderWidth: 2,
        marginBottom: 15,
        marginHorizontal: '2%',
        paddingHorizontal: 5
    },
    registerView: {
        borderColor: 'yellow',
        borderStyle: 'solid',
        borderWidth: 2,
        backgroundColor: 'black',
        paddingHorizontal: '20%',
        alignItems: 'center',
        marginHorizontal: '2%',
        marginTop: '25%'
    },
    button: {
        backgroundColor: 'yellow',
        width: '80%',
        height: 40,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        color: 'black'
    }
})

export default Notifications