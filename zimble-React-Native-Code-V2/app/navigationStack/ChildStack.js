import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChildDashBoard from '../screen/childflow/ChildDashBoard'

import NewEventRequest from '../screen/childflow/NewEventRequest'

import ChildJobRequestAccept from '../screen/childflow/ChildJobRequestAccept'

import TaskListChildPage from '../screen/childflow/TaskListChildPage'

import CreateSavingPage from '../screen/childflow/CreateSavingPage'

import TaskDetailsChildPage from '../screen/childflow/TaskDetailsChildPage'

import CalendarEvents from '../screen/childflow/CalendarEvents'

import NotificationListPage from '../screen/childflow/NotificationListPage'

import ChildJobRequestAcceptByOther from '../screen/childflow/ChildJobRequestAcceptByOther'

import ChildJobRewardRecived from '../screen/childflow/ChildJobRewardRecived'

import ChildEventForApproval from '../screen/childflow/ChildEventForApproval'

import ChildAccountLock from '../screen/childflow/ChildAccountLock'

import ChildJobRejected from '../screen/childflow/ChildJobRejected'

import ChildSendjobApproval from '../screen/childflow/ChildSendjobApproval'

import TransactionListPage from '../screen/childflow/TransactionListPage'

import SavingDetailsPage from '../screen/childflow/SavingDetailsPage'

import SavingListPage from '../screen/childflow/SavingListPage'

import ChatListPage from '../screen/childflow/ChatListPage'

import ChatDetailsPage from '../screen/childflow/ChatDetailsPage'

import SingleChildStatisticPage from '../screen/childflow/SingleChildStatisticPage'

import EducationPage from '../screen/childflow/EducationPage'

import EducationDetailsPage from '../screen/childflow/EducationDetailsPage'

import SpecialReward from '../screen/childflow/SpecialReward'

import GenerateCvvPage from '../screen/childflow/GenerateCvvPage'

import ChangeiPIN from '../screen/childflow/ChangeiPIN'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { Image } from 'react-native'

import { colors, fonts, localImages } from '../utils/constant'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const ChildTab = (props) => {
  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Wallet') {
              iconName = focused
                ? 'Tab2Active'
                : 'wallet';
            } else if (route.name === 'Tasks') {
              iconName = focused ? 'Tab3Active' : 'health_insurance';
            }
            else if (route.name === 'Chat') {
              iconName = focused ? 'Tab4Active' : 'financial_advice';
            }
            else if (route.name === 'Education') {
              iconName = focused ? 'Tab1Active' : 'accountant';
            }

          
            return <Image source={localImages[iconName]} style={{height:25, width:25 }}></Image>;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.childblue,
          inactiveTintColor: 'gray',
        }}
      >
      
      <Tab.Screen name="Wallet" component={ChildDashBoard} />
          <Tab.Screen name="Education" component={EducationPage} />
          
          <Tab.Screen name="Tasks" component={TaskListChildPage} />
          <Tab.Screen name="Chat" component={ChatListPage} />
       </Tab.Navigator>
    );

}

const ChildStack = (props) => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>


      
      <Stack.Screen name="ChildTab" component={ChildTab} />

      {/* <Stack.Screen name="EducationPage" component={EducationPage} /> */}

      <Stack.Screen name="ChangeiPIN" component={ChangeiPIN} />

      <Stack.Screen name="EducationDetailsPage" component={EducationDetailsPage} />

      <Stack.Screen name="SpecialReward" component={SpecialReward} />

      <Stack.Screen name="GenerateCvvPage" component={GenerateCvvPage} />

      <Stack.Screen name="SavingListPage" component={SavingListPage} />

      <Stack.Screen name="SavingDetailsPage" component={SavingDetailsPage} />

      <Stack.Screen name="SingleChildStatisticPage" component={SingleChildStatisticPage} />

      <Stack.Screen name="ChildSendjobApproval" component={ChildSendjobApproval} />
   
      <Stack.Screen name="ChildJobRejected" component={ChildJobRejected} />

      <Stack.Screen name="ChildAccountLock" component={ChildAccountLock} />

      <Stack.Screen name="ChildEventForApproval" component={ChildEventForApproval} />

      <Stack.Screen name="ChildJobRewardRecived" component={ChildJobRewardRecived} />

      <Stack.Screen name="ChildJobRequestAcceptByOther" component={ChildJobRequestAcceptByOther} />

      <Stack.Screen name="TransactionListPage" component={TransactionListPage} />
     
      <Stack.Screen name="CalendarEvents" component={CalendarEvents} />
   
      <Stack.Screen name="TaskDetailsChildPage" component={TaskDetailsChildPage} />
      
      {/* <Stack.Screen name="TaskListChildPage" component={TaskListChildPage} /> */}
      
      <Stack.Screen name="ChildJobRequestAccept" component={ChildJobRequestAccept} />

      <Stack.Screen name="NewEventRequest" component={NewEventRequest} />

      <Stack.Screen name="CreateSavingPage" component={CreateSavingPage} />
     
      <Stack.Screen name="NotificationListPage" component={NotificationListPage} />

      <Stack.Screen name="ChatDetailsPage" component={ChatDetailsPage} />

      {/* <Stack.Screen name="ChatListPage" component={ChatListPage} /> */}

    </Stack.Navigator>
  );

}



export default ChildStack