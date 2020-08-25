import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';

import { localImages } from '../utils/constant';

import HomeScreen from '../screen/afterBording/HomeScreen'
import DrawerScreen from '../screen/afterBording/DrawerScreen'
import WalletScreen from '../screen/afterBording/WalletScreen'
import ChangePasswordScreen from '../screen/afterBording/ChangePasswordScreen'
import NotificationScreen from '../screen/afterBording/NotificationScreen'
import ContactUsScreen from '../screen/afterBording/ContactUsScreen'
import HelpCenterScreen from '../screen/afterBording/HelpCenterScreen'
import ProfileScreen from '../screen/afterBording/ProfileScreen'
import AddEditAddressScreen from '../screen/afterBording/AddEditAddressScreen'
import AddressListScreen from '../screen/afterBording/AddressListScreen'
import CategoryScreen from '../screen/afterBording/CategoryScreen'
import WishListScreen from '../screen/afterBording/WishListScreen'
import MyCartScreen from '../screen/afterBording/MyCartScreen'
import MyOrderScreen from '../screen/afterBording/MyOrderScreen'
import VendorListingScreen from '../screen/afterBording/VendorListingScreen'
import DeliveryOptionScreen from '../screen/afterBording/DeliveryOptionScreen'
import OrderDetails from '../screen/afterBording/OrderDetails'
import ProductDetails from '../screen/afterBording/ProductDetails'
import ProductListScreen from '../screen/afterBording/ProductListScreen'
import AddNewAddressScreen from '../screen/afterBording/AddNewAddressScreen'
import OfferScreen from '../screen/afterBording/OfferScreen'
import ChangePhoneScreen from '../screen/afterBording/ChangePhoneScreen';
import ProductSearchScreen from '../screen/afterBording/ProductSearchScreen';
import TermsScreen from '../screen/afterBording/TermsScreen';
import AboutUsScreen from '../screen/afterBording/AboutUsScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator()
const Stack = createStackNavigator();

const TabStack = () => <>
    <Tab.Navigator
        screenOptions={({ route: { name } }) => ({
            tabBarIcon: ({ focused }) => {
                switch (name) {

                    case 'HomeScreen':
                        return <Image source={focused ? localImages.home_s : localImages.home_un} style={{ width: 40, height: 40 }} />

                    case 'MyOrderScreen':
                        return <Image source={focused ? localImages.order_s : localImages.order_un} style={{ width: 40, height: 40 }} />

                    case 'WishListScreen':
                        return <Image source={focused ? localImages.whistlist_s : localImages.whistlist_un} style={{ width: 40, height: 40 }} />

                    case 'OfferScreen':
                        return <Image source={focused ? localImages.offer_s : localImages.offer_un} style={{ width: 40, height: 40, }} />

                    case 'ProfileScreen':
                        return <Image source={focused ? localImages.account_s : localImages.account_un} style={{ width: 40, height: 40, }} />
                }


            },
        })}
        tabBarOptions={{
            showLabel: false,
            animationEnabled: false
        }}
    >
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="MyOrderScreen" component={MyOrderScreen} />
        <Tab.Screen name="WishListScreen" component={WishListScreen} />
        <Tab.Screen name="OfferScreen" component={OfferScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tab.Navigator>
</>

const DrawerStack = () => <>
    <Drawer.Navigator initialRouteName="TabStack" drawerContent={props => <DrawerScreen {...props} />}>
        <Drawer.Screen
            name="TabStack"
            component={TabStack}
        />
    </Drawer.Navigator>


</>


const AfterBoardingStack = () => <>
    <Stack.Navigator screenOptions={{
        headerShown: false,
        animationEnabled: false
    }}  >
        <Stack.Screen
            name="DrawerStack"
            component={DrawerStack}
        />
        <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
        />
        <Stack.Screen
            name="ProductDetails"
            component={ProductDetails}
        />
        <Stack.Screen
            name="WishListScreen"
            component={WishListScreen}
        />
        <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
            name="WalletScreen"
            component={WalletScreen} />
        <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
        />
        <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
        />
        <Stack.Screen
            name="ContactUsScreen"
            component={ContactUsScreen}
        />
        <Stack.Screen
            name="HelpCenterScreen"
            component={HelpCenterScreen}
        />
        <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
        />
        <Stack.Screen
            name="AddEditAddressScreen"
            component={AddEditAddressScreen}
        />
        <Stack.Screen
            name="AddressListScreen"
            component={AddressListScreen}
        />
        <Stack.Screen
            name="MyOrderScreen"
            component={MyOrderScreen}
        />
        <Stack.Screen
            name="VendorListingScreen"
            component={VendorListingScreen}
        />
        <Stack.Screen
            name="DeliveryOptionScreen"
            component={DeliveryOptionScreen}
        />
        <Stack.Screen
            name="MyCartScreen"
            component={MyCartScreen}
        />
        <Stack.Screen
            name="ProductListScreen"
            component={ProductListScreen}
        />
        <Stack.Screen
            name="ProductSearchScreen"
            component={ProductSearchScreen}
        />
        <Stack.Screen
            name="AddNewAddressScreen"
            component={AddNewAddressScreen}
        />

        <Stack.Screen
            name="ChangePhoneScreen"
            component={ChangePhoneScreen}
        />

        <Stack.Screen
            name="TermsScreen"
            component={TermsScreen}
        />

        <Stack.Screen
            name="AboutUsScreen"
            component={AboutUsScreen}
        />

    </Stack.Navigator>
</>

export default AfterBoardingStack