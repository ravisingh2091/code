import React, { Component } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, Image, Text, ScrollView } from 'react-native'
import RNGooglePlaces from 'react-native-google-places';

import axios from '../../api'
import Button, { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'
import InputBox, { InputViewBox, ErrorMsg } from '../../component/InputBox'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass';
import { CommonActions } from '@react-navigation/native';


const { height, width } = Dimensions.get('window')
class EditProfileScreen extends Component {
    sharedClass = new SharedClass();
    state = {
        screenHeight: height,
        _id: '',
        name: '',
        phone: '',
        altPhone: '',
        address: '',
        plotNumber: '',
        roadName: '',
        locality: '',
        city: '',
        state: '',
        pinCode: '',
        latitude: '28.89787',
        longitude: '78.0989',
        defaultStatus: false,
        loading: false,
        location: '',
        errors: {
            name: '',
            phone: '',
            altPhone: '',
            address: '',
            plotNumber: '',
            roadName: '',
            locality: '',
            city: '',
            state: '',
            pinCode: '',
        }
    }

    componentDidMount() {
        const { address, location } = this.props.route.params
        if (address) {

            this.setState({
                _id: address._id,
                name: address.name,
                phone: address.mobileNumber,
                altPhone: address.alternameMobile,
                address: address.address,
                plotNumber: address.plotNumber,
                roadName: address.roadName,
                locality: address.locality,
                city: address.city,
                state: address.state,
                pinCode: address.pincode,
                latitude: address.latitude,
                longitude: address.longitude,
                defaultStatus: address.defaultStatus,
            })
        }

        if (location) {
            this.setState({
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
            })

        }
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    GooglePlacesInput = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                let pinCode, city, locality, state
                for (var j = 0; j < place.addressComponents.length; j++) {

                    if (place.addressComponents[j].types.includes("postal_code")) {
                        pinCode = place.addressComponents[j].name;
                    }

                    if (place.addressComponents[j].types.includes("locality")) {
                        city = place.addressComponents[j].name;
                    }
                    if (place.addressComponents[j].types.includes("administrative_area_level_1")) {
                        state = place.addressComponents[j].name;
                    }

                    if (place.addressComponents[j].types.includes("sublocality_level_1")) {
                        locality = place.addressComponents[j].name;
                    }
                }
                this.setState({
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                    address: place.address,
                    locality,
                    pinCode,
                    city,
                    state
                })
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    };

    addAddress = async () => {
        const { name, phone, altPhone, address, plotNumber, roadName, locality, city, state, pinCode, latitude, longitude, defaultStatus, _id } = this.state

        this.setState({
            errors: {
                name: '',
                phone: '',
                altPhone: '',
                address: '',
                plotNumber: '',
                roadName: '',
                locality: '',
                city: '',
                state: '',
                pinCode: '',
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

        let reg = /^[6-9]\d{9}$/;
        if (!reg.test(phone)) {
            this.setState({
                errors: {
                    phone: 'Phone no is invalid/required',
                }
            })
            return
        }
        if (altPhone) {
            let reg = /^[6-9]\d{9}$/;
            if (!reg.test(altPhone)) {
                this.setState({
                    errors: {
                        altPhone: 'Alternate Phone no is invalid',
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

        if (!plotNumber.trim()) {
            this.setState({
                errors: {
                    plotNumber: 'House No/Building Name is invalid/required',
                }
            })
            return
        }
        if (!roadName.trim()) {
            this.setState({
                errors: {
                    roadName: 'Road Name/Area/Colony is invalid/required',
                }
            })
            return
        }
        if (!locality.trim()) {
            this.setState({
                errors: {
                    locality: 'Landmark is invalid/required',
                }
            })
            return
        }
        if (!city.trim()) {
            this.setState({
                errors: {
                    city: 'City is invalid/required',
                }
            })
            return
        }
        if (!state.trim()) {
            this.setState({
                errors: {
                    city: 'State is invalid/required',
                }
            })
            return
        }
        if (!pinCode) {
            this.setState({
                errors: {
                    pinCode: 'Pin Code is invalid/required',
                }
            })
            return
        }



        try {
            this.setState({ loading: true })
            let url = 'addAddress'
            let data = {
                mobileNumber: phone,
                alternameMobile: altPhone,
                countryCode: '+91',
                address,
                plotNumber,
                roadName,
                pincode: pinCode,
                locality,
                city,
                state,
                latitude,
                longitude,
                defaultStatus,
                name
            }
            if (_id) {
                url = 'editAddress'
                data.addressId = _id
            }

            let response = await axios.post(`user/${url}`, data)
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    name: '',
                    phone: '',
                    alternameMobile: '',
                    address: '',
                    plotNumber: '',
                    roadName: '',
                    locality: '',
                    city: '',
                    state: '',
                    pinCode: '',
                })

                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'success',
                    delay: 0
                })
                this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        { name: 'DrawerStack' },
                        {
                          name: 'AddressListScreen',
                        },
                      ],
                    })
                  );
                // if (this.state._id) {
                //     this.props.navigation.goBack()
                // } else {
                //     this.props.navigation.goBack()
                //     this.props.navigation.goBack()
                // }

            } else {
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }

        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }

    }

    render() {
        const { address, locality, city, state, pinCode, plotNumber, name, phone, altPhone, roadName, defaultStatus, loading, errors } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;

        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {loading && <Loder data={loading}></Loder>}

                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label="Add New Address"
                        labelStyle={{
                            color: colors.white,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null
                        }}
                    />
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={CustomStyles.scrollview}
                        scrollEnabled={scrollEnabled}
                        onContentSizeChange={this.onContentSizeChange}
                    >
                        <View style={{ alignItems: 'center' }}>

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="Name"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                value={name}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ name: text })}
                                iconName='user'
                                onIconClick={() => { }}
                            />
                            {errors.name ? <ErrorMsg message={errors.name} /> : null}

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="Phone Number"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                keyboardType={'numeric'}
                                value={phone}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ phone: text })}
                                iconName='callPng'
                                onIconClick={() => { }}
                            />
                            {errors.phone ? <ErrorMsg message={errors.phone} /> : null}
                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="Altername Number"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                keyboardType={'numeric'}
                                value={altPhone}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ altPhone: text })}
                                iconName='callPng'
                                onIconClick={() => { }}
                            />
                            {errors.altPhone ? <ErrorMsg message={errors.altPhone} /> : null}

                            <InputViewBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
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
                                onViewClick={() => { }}
                                onChangeText={(text) => { }}
                            />
                            {errors.address ? <ErrorMsg message={errors.address} /> : null}

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="House No/Building Name"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                value={plotNumber}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ plotNumber: text })}
                                iconName='location'
                                onIconClick={() => { }}
                            />
                            {errors.plotNumber ? <ErrorMsg message={errors.plotNumber} /> : null}
                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="Road Name/Area/Colony"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                value={roadName}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ roadName: text })}
                                iconName='location'
                                onIconClick={() => { }}
                            />
                            {errors.roadName ? <ErrorMsg message={errors.roadName} /> : null}

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width - 40)}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="Landmark"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                value={locality}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ locality: text })}
                                iconName='location'
                                onIconClick={() => { }}
                            />
                            {errors.loading ? <ErrorMsg message={errors.loading} /> : null}
                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={width - 40}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="City"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                value={city}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ city: text })}
                            />
                            {errors.city ? <ErrorMsg message={errors.city} /> : null}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>

                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width / 2) - 30}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="State"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                editable={true}
                                value={state}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ state: text })}
                            />
                            <InputBox
                                height={60}
                                backgroundColor={colors.inputBox}
                                width={(width / 2) - 30}
                                borderRadius={30}
                                marginTop={15}
                                placeholder="Pin Code"
                                placeholderColor={colors.placeHolderColor}
                                inputTextColor={colors.inputTextColor}
                                keyboardType={'numeric'}
                                editable={true}
                                value={pinCode.toString()}
                                maxLength={400}
                                onChangeText={(text) => this.setState({ pinCode: text })}
                            />
                        </View>
                        {errors.state ? <ErrorMsg message={errors.state} /> : null}
                        {errors.pinCode ? <ErrorMsg message={errors.pinCode} /> : null}

                        <View style={{ marginTop: 15, marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    backgroundColor: colors.ornageButton,
                                    height: 40,
                                    width: 40,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onTouchEnd={() => this.setState({ defaultStatus: !defaultStatus })}>
                                {
                                    defaultStatus
                                        ? <Image source={localImages.correct} style={{ width: 35, height: 35 }} />
                                        : null
                                }

                            </View>
                            <Text style={{ ...CustomStyles.textLine, marginLeft: 10 }}>Set as default address</Text>
                        </View>

                        <View style={{ marginTop: 15, alignSelf: 'center' }}>
                            <Button
                                height={60}
                                backgroundColor={colors.ornageButton}
                                width={width - 130}
                                borderRadius={8}
                                marginTop={20}
                                label="Add"
                                labelColor={colors.inputBox}
                                onAction={() => this.addAddress()}
                                fontSize={17}
                                fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                fontWeight={Platform.OS == 'ios' ? '700' : null}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    }

}

export default EditProfileScreen