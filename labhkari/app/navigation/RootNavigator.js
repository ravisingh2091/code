import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import notifee, { EventType } from '@notifee/react-native';


import Introstack from './Introsatck'
import AfterBoardingStack from './AfterBoardingStack';
const Stack = createStackNavigator();
const RootNavigator = (props) => {

  useEffect(() => {

    const unsubscribe = messaging().onMessage(onMessageReceived);
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification, remoteMessage.data
          );
        }
      });

    listener()
    return unsubscribe
  }, []);


  const onMessageReceived = async (message) => {
    console.log("[By NOTIFY]", { message })

    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });


    // Display a notification
    notifee.displayNotification({
      ...message.notification,
      android: {
        ...message.notification.android,
        channelId,
      },
    });
  }


  const listener = () => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      console.log("[Forground Event CLick ]", { type, detail })
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }

    });

  }


  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      {
        props.isAuth || props.isGaust
          ? <Stack.Screen name="AfterBoardingStack" component={AfterBoardingStack} />
          : <Stack.Screen name="Introstack" component={Introstack} />
      }
    </Stack.Navigator>
  );

}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
    isGaust: state.auth.isGaust,
  };
}

export default connect(mapStateToProps)(RootNavigator)