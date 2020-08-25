import React, { Component } from 'react'
import { View, SafeAreaView, StatusBar, Text, Image, Linking } from 'react-native'
import { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'
import { ConstactUsStyles } from '../style/ConstactUsStyles'


class ContactUsScreen extends Component {
    contactView = (image, text, type) => {
        return <View style={ConstactUsStyles.circleContainer} onTouchEnd={() => Linking.openURL(`${type}:${text}`)}>
            <View style={ConstactUsStyles.circle}>
                <Image source={image} style={ConstactUsStyles.image} />
            </View>
            <Text style={ConstactUsStyles.contactText}>{text}</Text>
        </View>
    }
    render() {
        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label="Contact Us"
                        labelStyle={{
                            color: colors.white,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null
                        }}
                    />
                    {this.contactView(localImages.call_s, '+91 98674433677', 'tel')}
                    {this.contactView(localImages.email_s, 'admin@labhkari.com', 'mailto')}
                    {this.contactView(localImages.web, 'www.labhkari.com', 'http')}

                </SafeAreaView>
            </View>
        </>
    }
}

export default ContactUsScreen