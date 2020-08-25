import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ParentDashBoard from '../screen/parentflow/ParentDashBoard'
import CreateTaskPage from '../screen/parentflow/CreateTaskPage'
import TaskListPage from '../screen/parentflow/TaskListPage'
import TransactionListPage from '../screen/parentflow/TransactionListPage'
import AccountPage from '../screen/parentflow/AccountPage'
import CreateTaskWithConPage from '../screen/parentflow/CreateTaskWithConPage'
import TopUpFamilyBalPage from '../screen/parentflow/TopUpFamilyBalPage'
// import ManageYourCardPage from '../screen/parentflow/ManageYourCardPage'
import ReferralPage from '../screen/parentflow/ReferralPage'
// import DeliveryPage from '../screen/parentflow/DeliveryPage'
// import ParentsMenuPage from '../screen/parentflow/ParentsMenuPage'
import SingleChildStatisticPage from '../screen/parentflow/SingleChildStatisticPage'
// import ReplaceCardPage from '../screen/parentflow/ReplaceCardPage'


import CalendarEvents from '../screen/parentflow/CalendarEvents'



import ActivateCardPage from '../screen/parentflow/ActivateCardPage'
import RequestNewCardPage from '../screen/parentflow/RequestNewCardPage'
// import TopUpChildCardPage from '../screen/parentflow/TopUpChildCardPage'

import TaskDetailsParentPage from '../screen/parentflow/TaskDetailsParentPage'

import SubscriptionPlan from '../screen/parentflow/SubscriptionPlan'
import NotificationListPage from '../screen/parentflow/NotificationListPage'



import JobApprovalNotification from '../screen/parentflow/JobApprovalNotification'
import JobAcceptedNotification from '../screen/parentflow/JobAcceptedNotification'
import SetUpAllowancePage from '../screen/parentflow/SetUpAllowancePage'


import SetupLimitPage from '../screen/parentflow/SetupLimitPage'
import ChatListPage from '../screen/parentflow/ChatListPage'
import ChatDetailsPage from '../screen/parentflow/ChatDetailsPage'


import SavingListPage from '../screen/parentflow/SavingListPage'
import AddMoreChildPage from '../screen/parentflow/AddMoreChildPage'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Image } from 'react-native'

import { colors, fonts, localImages } from '../utils/constant'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const ParentTab = (props) => {
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
              else if (route.name === 'Accounts') {
                iconName = focused ? 'Tab5Active' : 'bank_2';
              }
  
            
              return <Image source={localImages[iconName]} style={{height:25, width:25 }}></Image>;
            },
          })}
          tabBarOptions={{
            activeTintColor: colors.childblue,
            inactiveTintColor: 'gray',
          }}
        >
        
            <Tab.Screen name="Wallet" component={ParentDashBoard} />
            <Tab.Screen name="Tasks" component={TaskListPage} />
            <Tab.Screen name="Chat" component={ChatListPage} />
            <Tab.Screen name="Accounts" component={AccountPage} />
         </Tab.Navigator>
      );

}

const ParentStack = (props) => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>


            <Stack.Screen name="ParentTab" component={ParentTab} />
            <Stack.Screen name="ChatDetailsPage" component={ChatDetailsPage} />
            {/* <Stack.Screen name="ChatListPage" component={ChatListPage} /> */}
            <Stack.Screen name="SetupLimitPage" component={SetupLimitPage} />
            <Stack.Screen name="SetUpAllowancePage" component={SetUpAllowancePage} />
            {/* <Stack.Screen name="AccountPage" component={AccountPage} /> */}

            {/* <Stack.Screen name="BillingCustome" component={BillingCustome} /> */}
            <Stack.Screen name="JobAcceptedNotification" component={JobAcceptedNotification} />

            <Stack.Screen name="JobApprovalNotification" component={JobApprovalNotification} />

            <Stack.Screen name="SubscriptionPlan" component={SubscriptionPlan} />
            <Stack.Screen name="TaskDetailsParentPage" component={TaskDetailsParentPage} />
            {/* <Stack.Screen name="BadgesDetailsPrentPage" component={BadgesDetailsPrentPage} /> */}
            <Stack.Screen name="RequestNewCardPage" component={RequestNewCardPage} />
            {/* <Stack.Screen name="ChildSuccessPage" component={ChildSuccessPage} /> */}
            <Stack.Screen name="AddMoreChildPage" component={AddMoreChildPage} />
            <Stack.Screen name="ActivateCardPage" component={ActivateCardPage} />
            <Stack.Screen name="CalendarEvents" component={CalendarEvents} />
            {/* <Stack.Screen name="BadagesListPage" component={BadagesListPage} /> */}
            {/* <Stack.Screen name="CreateBadgesPage" component={CreateBadgesPage} /> */}
            {/* <Stack.Screen name="BillingInfo" component={BillingInfo} /> */}
            <Stack.Screen name="SingleChildStatisticPage" component={SingleChildStatisticPage} />

            {/* <Stack.Screen name="ParentsMenuPage" component={ParentsMenuPage} /> */}
            {/* <Stack.Screen name="DeliveryPage" component={DeliveryPage} /> */}
            <Stack.Screen name="ReferralPage" component={ReferralPage} />
            {/* <Stack.Screen name="ManageYourCardPage" component={ManageYourCardPage} /> */}

            <Stack.Screen name="TopUpFamilyBalPage" component={TopUpFamilyBalPage} />

            {/* <Stack.Screen name="TopUpChildCardPage" component={TopUpChildCardPage} /> */}
            {/* <Stack.Screen name="TaskListPage" component={TaskListPage} /> */}

            <Stack.Screen name="TransactionListPage" component={TransactionListPage} />
            <Stack.Screen name="CreateTaskWithConPage" component={CreateTaskWithConPage} />
            <Stack.Screen name="CreateTaskPage" component={CreateTaskPage} />
            {/* <Stack.Screen name="ReplaceCardPage" component={ReplaceCardPage} /> */}
           
            <Stack.Screen name="NotificationListPage" component={NotificationListPage} />
            <Stack.Screen name="SavingListPage" component={SavingListPage} />
        </Stack.Navigator>
    );

}






export default ParentStack