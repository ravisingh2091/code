import React, { Component } from 'react'
import { ScrollView, StatusBar, Image, View, Text, SafeAreaView, Dimensions, Platform } from 'react-native'
import { connect } from 'react-redux';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

import axios from '../../api'
import { colors, fonts, localImages } from '../../utils/constant'
import { CustomStyles } from '../style/CustomStyles'
import SharedClass from '../../utils/SharedClass'
import InputBox, { ErrorMsg, OtpBox } from '../../component/InputBox'
import Button, { HeaderWithBack } from '../../component/Button'
import Loder from '../../utils/Loder'
import { userUpdate } from '../../redux/actions/AllAction';

const { height, width } = Dimensions.get('window');
class ChangePhoneScreen extends Component {
    constructor(props) {
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            screenHeight: height,
            countryCode: 'IN',
            callingCode: '+91',
            withCountryNameButton: false,
            withFlag: true,
            withFilter: true,
            withAlphaFilter: false,
            loading: false,
            otpScreen: false,
            phone: '',
            otp: '',
            errors: {
                phone: '',
            },
        }
    }


    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };


    onSelect = (country) => {
        this.setState({
            callingCode: '+' + country.callingCode[0],
            countryCode: country.cca2
        })
    }



    checkPhone = async () => {
        const { phone, callingCode } = this.state

        this.setState({
            errors: {
                phone: '',
            }
        })
        let reg = /^[6-9]\d{9}$/;
        if (!reg.test(phone)) {
            this.setState({
                errors: {
                    phone: 'Phone no is invalid/required',
                }
            })
            return
        }

        try {
            this.setState({ loading: true })

            let response = await axios.post('user/checkUserMobileNumber', {
                countryCode: callingCode,
                mobileNumber: phone
            })
            if (response && response.data.status == 200) {
                this.setState({ otpScreen: true })
            } else {
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
            this.setState({ loading: false })
        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }

    }

    onOtpVerify = async () => {
        const { phone, callingCode, otp } = this.state

        try {
            this.setState({ loading: true })

            let response = await axios.post('user/otpVerification', {
                countryCode: callingCode,
                mobileNumber: phone,
                otp
            })
            if (response && response.data.status == 200) {
                this.updatePhone();
            } else {
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
            this.setState({ loading: false })
        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }
    }
    updatePhone = async () => {
        const { phone, callingCode } = this.state

        try {
            this.setState({ loading: true })

            let response = await axios.post('user/changeMobileNumber', {
                countryCode: callingCode,
                mobileNumber: phone
            })
            if (response && response.data.status == 200) {
                let user = { ...this.props.user };
                user.countryCode = callingCode
                user.mobileNumber = phone
                this.props.userUpdate(user);
                this.props.navigation.goBack()
            } else {
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
            this.setState({ loading: false })
        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }
    }
    render() {
        const { errors, loading, otpScreen, callingCode, phone } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;
        return (
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {loading && <Loder data={loading}></Loder>}
                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label="Change Phone"
                        labelStyle={{
                            color: colors.white,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null
                        }}
                    />
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={CustomStyles.scrollview}
                            scrollEnabled={scrollEnabled}
                            onContentSizeChange={this.onContentSizeChange}
                        >
                            {
                                otpScreen
                                    ? <View style={[CustomStyles.mainContent, { alignItems: 'center' }]}>
                                        <View style={{ alignItems: 'center', marginBottom: 30 }}>
                                            <View style={[CustomStyles.card, { marginVertical: 30 }]}>
                                                <Image source={localImages.msg} style={{ height: 200, width: 200 }} />
                                            </View>
                                            <View>
                                                <Text style={[CustomStyles.textLine, { color: colors.backText, textAlign: 'center', fontSize: 20 }]}>Please Enter One Time Password that send to your phone number </Text>
                                                <Text style={[CustomStyles.textLine, { color: colors.backText, textAlign: 'center', fontSize: 20 }]}>{callingCode + phone}</Text>
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
                                                {this.state.errors.otp ? <ErrorMsg message={this.state.errors.otp} /> : null}
                                                {this.props.serverError ? <ErrorMsg message={this.props.serverError} /> : null}
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
                                            </View>
                                        </View>
                                    </View>
                                    : <View
                                        style={{
                                            flexGrow: 1,
                                            padding: 10,
                                            alignItems: 'center',
                                            marginVertical: 30
                                        }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={[CustomStyles.inputBoxStyle, { backgroundColor: colors.inputBox, height: 60, width: 60, marginRight: 10, justifyContent: 'center', alignItems: 'center' }]}>
                                                <CountryPicker countryCode={'SG'} theme={DARK_THEME}
                                                    countryCode={this.state.countryCode}
                                                    withFilter={this.state.withFilter}
                                                    withAlphaFilter={this.state.withAlphaFilter}
                                                    withFlag={this.state.withFlag}
                                                    withCountryNameButton={this.state.withCountryNameButton}
                                                    onSelect={this.onSelect}
                                                />
                                            </View>
                                            <InputBox
                                                height={60}
                                                backgroundColor={colors.inputBox}
                                                width={(width - 130)}
                                                borderRadius={30}
                                                marginTop={0}
                                                placeholder="Enter Mobile No."
                                                label="Enter Mobile No."
                                                labelColor={colors.labelColor}
                                                placeholderColor={colors.placeHolderColor}
                                                inputTextColor={colors.inputTextColor}
                                                secureTextEntry={false}
                                                keyboardType={'numeric'}
                                                editable={true}
                                                value={phone}
                                                maxLength={400}
                                                iconName="callPng"
                                                onIconClick={() => { }}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        phone: text
                                                    })
                                                }}
                                            />

                                        </View>
                                        {errors.phone ? <ErrorMsg message={errors.phone} /> : null}

                                        <View style={{ width: width, alignItems: 'center', marginTop: 50 }}>
                                            <Button
                                                height={60}
                                                backgroundColor={colors.ornageButton}
                                                width={width - 130}
                                                borderRadius={8}
                                                marginTop={0}
                                                label="Update"
                                                labelColor={colors.inputBox}
                                                onAction={() => this.checkPhone()}
                                                fontSize={17}
                                                fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                                fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                                fontWeight={Platform.OS == 'ios' ? '700' : null}
                                            ></Button>
                                        </View>
                                    </View>
                            }
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
}
const mapDispatchToProps = dispatch => {
    return {
        userUpdate: (user) => {
            dispatch(userUpdate(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePhoneScreen)

