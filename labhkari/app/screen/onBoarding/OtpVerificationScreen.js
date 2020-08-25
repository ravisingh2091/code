import React, { Component } from 'react'
import { ScrollView, StatusBar, Image, View, Text, SafeAreaView, Dimensions, Platform } from 'react-native'
import { connect } from 'react-redux';

import { colors, fonts, localImages } from '../../utils/constant'
import SharedClass from '../../utils/SharedClass'
import { OtpBox, ErrorMsg } from '../../component/InputBox'
import Button, { OnBordingHeader } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import Loder from '../../utils/Loder'
import { otpVerify } from '../../redux/actions/AllAction'

const { height, width } = Dimensions.get('window');


class OtpVerificationScreen extends Component {
    constructor(props) {
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            screenHeight: height,
            otp: '',
            errors: {
                otp: ''
            }
        }
        console.log(this.props.route.params)
    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    onOtpVerify = () => {
        this.setState({
            errors: {
                otp: '',
            }
        })
        let reg = /^\d{4}$/;
        if (!reg.test(this.state.otp)) {
            this.setState({
                errors: {
                    otp: 'OTP is invalid/required',
                }
            })
            return
        }

        this.props.otpVerify(this.state.otp, this.props.route.params)
    }

    render() {
        const { mobileNumber, countryCode } = this.props.route.params
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;
        return (
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {this.props.loading && <Loder data={this.props.loading}></Loder>}
                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <View style={{ flex: 1 }}>
                        <OnBordingHeader onActionLeft={() => { this.props.navigation.goBack() }} ></OnBordingHeader>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={CustomStyles.scrollview}
                            scrollEnabled={scrollEnabled}
                            onContentSizeChange={this.onContentSizeChange}
                        >
                            <View style={[CustomStyles.mainContent, { alignItems: 'center' }]}>
                                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                                    <View style={[CustomStyles.card, { marginVertical: 30 }]}>
                                        <Image source={localImages.msg} style={{ height: 200, width: 200 }} />
                                    </View>
                                    <View>
                                        <Text style={[CustomStyles.textLine, { color: colors.backText, textAlign: 'center', fontSize: 20 }]}>Please Enter One Time Password that send to your phone number </Text>
                                        <Text style={[CustomStyles.textLine, { color: colors.backText, textAlign: 'center', fontSize: 20 }]}>{countryCode + mobileNumber}</Text>
                                    </View>
                                    <OtpBox
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={(width - 60)}
                                        borderRadius={30}
                                        marginTop={20}
                                        placeholder="otp"
                                        label="otp"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}
                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        editable={true}
                                        value={this.state.otp}
                                        maxLength={400}
                                        onIconClick={() => {

                                        }}
                                        iconName="ser_a"
                                        onChangeText={(text) => {
                                            this.setState({
                                                otp: text
                                            })
                                        }}
                                    />

                                    <View style={{ width: width, alignItems: 'center' }}>
                                        <Button
                                            height={60}
                                            backgroundColor={colors.ornageButton}
                                            width={width - 130}
                                            borderRadius={8}
                                            marginTop={80}
                                            label="VERIFY"
                                            labelColor={colors.inputBox}
                                            onAction={() => this.onOtpVerify()}
                                            fontSize={17}
                                            fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                            fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                            fontWeight={Platform.OS == 'ios' ? '700' : null}
                                        />
                                        {this.state.errors.otp ? <ErrorMsg message={this.state.errors.otp} /> : null}
                                        {this.props.serverError ? <ErrorMsg message={this.props.serverError} /> : null}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const mapToProp = state => {
    return {
        serverError: state.auth.error,
        loading: state.auth.loading
    }
}
export default connect(mapToProp, { otpVerify })(OtpVerificationScreen)

