import React, { Component } from 'react'
import { ScrollView, StatusBar, Image, View, SafeAreaView, Dimensions, Platform } from 'react-native'
import { connect } from 'react-redux';
import RNGooglePlaces from 'react-native-google-places';

import { colors, fonts, localImages } from '../../utils/constant'
import SharedClass from '../../utils/SharedClass'
import InputBox, { ErrorMsg, InputViewBox } from '../../component/InputBox'
import Button, { } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import Loder from '../../utils/Loder'
import { createProfile } from './../../redux/actions/AllAction'

const { height, width } = Dimensions.get('window');


class CreateProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            screenHeight: height,
            name: '',
            email: '',
            password: '',
            address: '',
            password: '',
            confirmPassword: '',
            latitude: '28.89787',
            longitude: '78.0989',
            profilePic: '',
            secureTextEntry: true,
            secureTextEntry2: true,
            errors: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        }


    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    onProfileCreate = () => {
        const { mobileNumber, countryCode } = this.props.route.params
        const { name, email, address, password, confirmPassword, latitude, longitude } = this.state

        this.setState({
            errors: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        })

        if (!name.trim()) {
            this.setState({
                errors: {
                    name: 'Name is invalid/required',
                }
            })
            return
        }

        if (email) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!reg.test(email)) {
                this.setState({
                    errors: {
                        email: 'email is invalid/required',
                    }
                })
                return
            }
        }

        if (!address.trim()) {
            this.setState({
                errors: {
                    address: 'Address is invalid/required',
                }
            })
            return
        }

        if (!password.trim() || password.length < 6) {
            this.setState({
                errors: {
                    password: 'Password is invalid/required/greter then 6 letter',
                }
            })
            return
        }
        if (password.trim() != confirmPassword.trim()) {
            this.setState({
                errors: {
                    confirmPassword: 'Confirm Password must same',
                }
            })
            return
        }

        let data = {
            name, email, address, password, mobileNumber, countryCode, latitude, longitude
        }
        this.props.createProfile(data)

    }
    GooglePlacesInput = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                this.setState({
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                    address: place.address,
                })

                console.log(this.state)
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    };
    render() {
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;
        const { errors, name, email, address, password, confirmPassword, secureTextEntry, secureTextEntry2 } = this.state

        return (
            <View style={CustomStyles.container}>
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
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={(width - 60)}
                                        borderRadius={30}
                                        marginTop={20}
                                        placeholder="Name"
                                        label="Name"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}
                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        editable={true}
                                        value={name}
                                        maxLength={400}
                                        onIconClick={() => { }}
                                        iconName="ser_a"
                                        onChangeText={(text) => {
                                            this.setState({ name: text })
                                        }}
                                    />
                                    {errors.name ? <ErrorMsg message={errors.name} /> : null}
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={(width - 60)}
                                        borderRadius={30}
                                        marginTop={15}
                                        placeholder="Email Id"
                                        label="Email Id"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}
                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        editable={true}
                                        value={email}
                                        maxLength={400}
                                        onIconClick={() => { }}
                                        iconName="mail"
                                        onChangeText={(text) => {
                                            this.setState({ email: text })
                                        }}
                                    />
                                    {errors.email ? <ErrorMsg message={errors.email} /> : null}
                                    <InputViewBox
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={(width - 60)}
                                        borderRadius={30}
                                        marginTop={15}
                                        placeholder="Address"
                                        label="Address"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}
                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={false}
                                        editable={true}
                                        value={address}
                                        maxLength={400}
                                        onIconClick={() => { }}
                                        iconName="location"
                                        onViewClick={() => this.GooglePlacesInput()}
                                        onChangeText={(text) => { }}
                                    />
                                    {errors.address ? <ErrorMsg message={errors.address} /> : null}
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={(width - 60)}
                                        borderRadius={30}
                                        marginTop={15}
                                        placeholder="Password"
                                        label="Password"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}
                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={secureTextEntry}
                                        editable={true}
                                        value={password}
                                        maxLength={400}

                                        onIconClick={() => {
                                            this.setState({
                                                secureTextEntry: !secureTextEntry
                                            })
                                        }}
                                        iconName="eye"
                                        onChangeText={(text) => {
                                            this.setState({ password: text })
                                        }}
                                    />
                                    {errors.password ? <ErrorMsg message={errors.password} /> : null}
                                    <InputBox
                                        height={60}
                                        backgroundColor={colors.inputBox}
                                        width={(width - 60)}
                                        borderRadius={30}
                                        marginTop={15}
                                        placeholder="Confirm Password"
                                        label="Confirm Password"
                                        labelColor={colors.labelColor}
                                        placeholderColor={colors.placeHolderColor}
                                        inputTextColor={colors.inputTextColor}
                                        secureTextEntry={secureTextEntry2}
                                        editable={true}
                                        value={confirmPassword}
                                        maxLength={400}
                                        onIconClick={() => {
                                            this.setState({
                                                secureTextEntry2: !secureTextEntry2
                                            })
                                        }}
                                        iconName="eye"
                                        onChangeText={(text) => {
                                            this.setState({ confirmPassword: text })
                                        }}
                                    />
                                    {errors.confirmPassword ? <ErrorMsg message={errors.confirmPassword} /> : null}
                                    {this.props.serverError ? <ErrorMsg message={this.props.serverError} /> : null}
                                    <View style={{ width: width, alignItems: 'center' }}>
                                        <Button
                                            height={60}
                                            backgroundColor={colors.ornageButton}
                                            width={width - 130}
                                            borderRadius={8}
                                            marginTop={40}
                                            label="CREATE PROFILE"
                                            labelColor={colors.inputBox}
                                            onAction={() => this.onProfileCreate()}
                                            fontSize={17}
                                            fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                            fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                            fontWeight={Platform.OS == 'ios' ? '700' : null}
                                        ></Button>
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
export default connect(mapToProp, { createProfile })(CreateProfileScreen)

