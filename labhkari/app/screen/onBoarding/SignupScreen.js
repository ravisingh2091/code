import React, { Component } from 'react'
import { ScrollView, StatusBar, Image, View, Text, SafeAreaView, Dimensions, Platform } from 'react-native'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import { connect } from 'react-redux';

import { checkAndSendOtp, skipToExplore } from './../../redux/actions/AllAction'

import { colors, fonts, localImages } from '../../utils/constant'
import SharedClass from '../../utils/SharedClass'
import { CustomStyles } from '../style/CustomStyles'
import InputBox, { ErrorMsg } from '../../component/InputBox'
import Button, { ButtonWithoutShadow } from '../../component/Button'
import Loder from '../../utils/Loder'

const { height, width } = Dimensions.get('window');

class SignupScreen extends Component {
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
            phone: '',
            referal: '',
            secureTextEntry: true,
            errors: {
                phone: ''
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

    onSkipToExplore = () => {
        this.props.skipToExplore()
    }

    onSignUp = () => {
        const { phone, referal, callingCode } = this.state
        this.setState({
            errors: {
                phone: ''
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

        this.props.checkAndSendOtp(callingCode, phone, referal)
    }

    render() {
        const { errors, phone, referal } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;
        return <><View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {this.props.loading && <Loder data={this.props.loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={CustomStyles.scrollview}
                        scrollEnabled={scrollEnabled}
                        onContentSizeChange={this.onContentSizeChange}
                    >
                        <View style={[CustomStyles.mainContent, { alignItems: 'center' }]}>
                            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                                <View style={[CustomStyles.card, { marginVertical: 30 }]}>
                                    <Image source={localImages.logo} style={{ height: 150, width: 150 * 1.15 }} />
                                </View>
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
                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBox}
                                    width={(width - 60)}
                                    borderRadius={30}
                                    marginTop={20}
                                    placeholder="Referal Code"
                                    label="Referal Code"
                                    labelColor={colors.labelColor}
                                    placeholderColor={colors.placeHolderColor}
                                    inputTextColor={colors.inputTextColor}
                                    secureTextEntry={this.state.secureTextEntry}
                                    editable={true}
                                    value={referal}
                                    maxLength={400}
                                    onIconClick={() => { }}
                                    iconName="offer"
                                    onChangeText={(text) => {
                                        this.setState({
                                            referal: text
                                        })
                                    }}
                                />
                                {this.props.serverError ? <ErrorMsg message={this.props.serverError} /> : null}
                                <View style={{ width: width, alignItems: 'center' }}>
                                    <Button
                                        height={60}
                                        backgroundColor={colors.ornageButton}
                                        width={width - 130}
                                        borderRadius={8}
                                        marginTop={55}
                                        label="SIGN UP"
                                        labelColor={colors.inputBox}
                                        onAction={() => this.onSignUp()}
                                        fontSize={17}
                                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                        fontWeight={Platform.OS == 'ios' ? '700' : null}
                                    />
                                    <Button
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={width - 130}
                                        borderRadius={8}
                                        marginTop={20}
                                        label="Skip to explore"
                                        labelColor={colors.blueText}
                                        onAction={() => this.onSkipToExplore()}
                                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                        fontSize={17}
                                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                        fontWeight={Platform.OS == 'ios' ? '700' : null}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={CustomStyles.textLine}>Already have account </Text>
                                    <ButtonWithoutShadow
                                        height={60}
                                        backgroundColor={colors.transparentBackground}
                                        width={50}
                                        borderRadius={8}
                                        marginTop={0}
                                        label="Login"
                                        labelColor={colors.ornageButton}
                                        onAction={() => { this.props.navigation.goBack() }}
                                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                        fontWeight={Platform.OS == 'ios' ? '700' : null}
                                        fontSize={17}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
        </>
    }
}

const mapToProp = state => {
    return {
        serverError: state.auth.error,
        loading: state.auth.loading
    }
}
export default connect(mapToProp, { checkAndSendOtp, skipToExplore })(SignupScreen)

