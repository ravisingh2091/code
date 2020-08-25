import React from 'react'
import { View, Text, Dimensions, Image, Alert } from 'react-native'
import { connect } from 'react-redux';

import { logoutUser, exitToExplore } from "./../../redux/actions/AllAction"
import { localImages } from '../../utils/constant'
import { SideButton } from '../../component/Button';
import { DrawerStyles } from '../style/DrawerStyles';
const { height } = Dimensions.get('window');

const DrawerScreen = (props) => {
    const { isGaust, user, navigation } = props

    const goToPage = (page) => {
        navigation.navigate(page)
    }

    const logout = () => {
        Alert.alert(
            'Alert',
            'Do you want to Logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        props.logoutUser()
                    }
                },
            ],
            { cancelable: false },
        );

    }
    return <>
        <View style={DrawerStyles.mainContainer}>
            <Image
                style={{ width: '100%', height: height / 4 }}
                source={localImages.sideMenu}
            />
            <View style={DrawerStyles.imageView}>
                <Image
                    style={DrawerStyles.image}
                    source={{ uri: isGaust ? 'https://biowikis.com/wp-content/uploads/2019/01/Jason-Momoa-Bio-Wiki-Net-Worth-180x180.jpg' : user?.profilePic }}
                />
            </View>
            <Text style={DrawerStyles.nameText}>Hi, {isGaust ? "Gaust" : user?.name}</Text>
            <View style={DrawerStyles.navContainer}>
                <SideButton
                    title="My Wallet"
                    onAction={() => goToPage('WalletScreen')}
                    image={localImages.wallet}
                />
                <SideButton
                    title="Change Password"
                    onAction={() => goToPage('ChangePasswordScreen')}
                    image={localImages.change}
                />
                <SideButton
                    title="Notification"
                    onAction={() => goToPage('NotificationScreen')}
                    image={localImages.noti}
                />
                <SideButton
                    title="Address Book"
                    onAction={() => goToPage('AddressListScreen')}
                    image={localImages.location}
                />
                <SideButton
                    title="Contact Us"
                    onAction={() => goToPage('ContactUsScreen')}
                    image={localImages.email_black}
                />
                <SideButton
                    title="Rate Us"
                    onAction={() => { }}
                    image={localImages.star}
                />
                <SideButton
                    title="Help Center"
                    onAction={() => goToPage('HelpCenterScreen')}
                    image={localImages.help}
                />

                <SideButton
                    title="About Us"
                    onAction={() => goToPage('AboutUsScreen')}
                    image={localImages.query}
                />
                <SideButton
                    title="Refer & Earn"
                    onAction={() => { }}
                    image={localImages.share}
                />
                <SideButton
                    title="Terms and Conditions"
                    onAction={() => goToPage('TermsScreen')}
                    image={localImages.tc}
                />
                {
                    isGaust
                        ? <SideButton
                            title="Login"
                            onAction={() => props.exitToExplore()}
                            image={localImages.login}
                        />
                        : <SideButton
                            title="Logout"
                            onAction={() => logout()}
                            image={localImages.logout}
                        />
                }

            </View>
        </View>
    </>
}

const mapStateToProps = (state) => {
    return {
        isGaust: state.auth.isGaust,
        user: state.auth.user,
    };
}
export default connect(mapStateToProps, { logoutUser, exitToExplore })(DrawerScreen)