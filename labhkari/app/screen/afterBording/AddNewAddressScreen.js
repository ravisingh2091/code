/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
const { height, width } = Dimensions.get("window");
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import Geocoder from 'react-native-geocoding';
import RNGooglePlaces from 'react-native-google-places';
import Button, { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'
import InputBox, { InputViewBox, ErrorMsg } from '../../component/InputBox'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass';
const mapIcon = require('../../assets/images/map_pin.png');
const addressIcon = require('../../assets/images/address.png');

// const home = require('../image/tab/home.png');
// const home_selected = require('../image/tab/home_selected.png');

// const user = require('../image/tab/more_un.png');
// const user_selected = require('../image/tab/more_s.png');

// const myrequest = require('../image/tab/my_request_un.png');
// const myrequest_selected = require('../image/tab/my_request_s.png');
// const sell = require('../image/tab/sell.png');
// const notification = require('../image/tab/notification_un.png');
// const notification_selected = require('../image/tab/notification_s.png');

// import { StackActions, NavigationActions } from 'react-navigation';
// import {storeData,RemoveItem, getStoreData} from '../utils/AsyncStore'
//import Marker from 'react-native-maps';
class AddNewAddressScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
        // headerStyle: {
        //     backgroundColor: '#093bb4',
        //     shadowOpacity: 0,
        //     shadowOffset: {
        //       height: 0,

        //   },elevation: 0 ,
        //     shadowRadius: 0,
        // },
        // headerTintColor:'#19191E',


        // headerTitle: (
        //   <View style={{flex:1,alignItems:'center',justifyContent: 'flex-start'}}>
        //     <Text style={{color: '#19191E',fontSize:18,lineHeight: 18}}>Login</Text>
        //   </View>
        // ),
        // headerRight: (
        //     <View>
        //     </View>
        //     )
    })

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: null,
            data: [],
            url: 'www.mobulous.com',
            LatLng: {
                latitude: 28.535517,
                longitude: 77.391029,
            },
            latitude: 28.535517,
            longitude: 77.391029,
            currentLat: null,
            currentLong: null,
            currentAddress: null,
            changeStatus: true
        }

    }



    componentDidMount() {
        //this.getOGTagsData(this.state.url)
        Geocoder.init("AIzaSyBRc60dgzwy-6ilVQZxcdUfjLrWMJmEG9I");
        // console.log(getStoreData('kabadiUser'))
        this._getCurrentLocation()
        this._getCurrentAddress(this.state.latitude, this.state.longitude)
        this.getLocalData()
    }
    async getLocalData() {
        //   const data= 
        // await getStoreData('kabadiUser')
        //   console.log(JSON.parse(data))
    }

    _getCurrentLocation() {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                console.log(location);
                this.setState({
                    // latitude:location.latitude,
                    // longitude:location.longitude,
                    currentLat: location.latitude,
                    currentLong: location.longitude,
                }, function () {
                    this._getCurrentAddress(location.latitude, location.longitude)
                })
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })

        // debugger
    }

    _getCurrentAddress = (lat, long) => {
        Geocoder.from({
            latitude: lat,
            longitude: long
        })
            .then(json => {
                var location = json.results[0].formatted_address;

                this.setState({
                    currentAddress: location,
                    latitude: lat,
                    longitude: long,
                })
            })
            .catch(error => console.warn(error));
    }
    _onPressButton() {
        // this.props.navigation.navigate('OtpScreen')
        //debugger
    }

    _onRegionChange = (e) => {

        if (this.state.changeStatus) {
            this.setState({
                latitude: e.latitude,
                longitude: e.longitude,
                currentLat: e.latitude,
                currentLong: e.longitude,
            }, function () {
                this._getCurrentAddress(e.latitude, e.longitude)
            })
        }

    }

    _onChangeAddress() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {

                this.setState({
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                    currentLat: place.location.latitude,
                    currentLong: place.location.longitude,
                    currentAddress: place.address
                }, function () {
                    // this._getCurrentAddress(e.latitude,e.longitude)
                })

            })
            .catch(error => {
                console.log(error.message)
            });
    }

    handleIconPress = () => {
        console.log('Pressed X');
    }

    _onBook() {

    }


    _onGoToPage(page) {

        if (page == 'AddKabadDetailsScreen') {
            this.props.navigation.navigate('AddKabadDetailsScreen')
            return

        }

    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        showsUserLocation={true}
                        onRegionChangeComplete={this._onRegionChange}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}

                    >
                    </MapView>

                    <View style={{ position: 'absolute', bottom: 50, width: width, backgroundColor: '#FFF', borderRadius: 5, }}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ width: 30, height: 60, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                                <Image
                                    style={{ height: 45, width: 30 }}
                                    source={addressIcon}
                                >

                                </Image>
                            </View>
                            <View style={{ marginHorizontal: 10, width: width - 170, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                <Text style={{ fontFamily: 'SourceSansPro-Regular' }}>{this.state.currentAddress}</Text>
                            </View>
                            <View style={{ width: 70, height: 60, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                <TouchableOpacity onPress={() => this._onChangeAddress()} style={{ borderColor: '#F58634', borderWidth: .7 }}>
                                    <Text style={{ fontFamily: 'SourceSansPro-Regular', color: '#F58634', marginVertical: 5, marginHorizontal: 5, borderRadius: 5 }}>CHANGE</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                        <View style={{ marginTop: 15, alignSelf: 'center' }}>
                            <Button
                                height={60}
                                backgroundColor={colors.ornageButton}
                                width={width - 130}
                                borderRadius={8}
                                marginTop={20}
                                label="Confirm "
                                labelColor={colors.inputBox}
                                onAction={() => {
                                    this.props.navigation.navigate('AddEditAddressScreen', {
                                        address: '', location: {
                                            address: this.state.currentAddress,
                                            latitude: this.state.latitude,
                                            longitude: this.state.longitude,

                                        }
                                    })
                                }}
                                fontSize={17}
                                fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                fontWeight={Platform.OS == 'ios' ? '700' : null}
                            />
                        </View>
                    </View>

                    <View style={{ position: 'absolute', top: height / 2 - 48, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ height: 50, width: 34.88 }}
                            source={mapIcon}
                        >

                        </Image>
                    </View>


                </View>

            </View>
        );
    }

}
export default AddNewAddressScreen
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: height,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mainView: {
        marginHorizontal: 20,
        marginTop: 20
    },
    textSizeOne: {
        fontSize: 30,
        color: '#19191E'
    },
    textSizeTwo: {
        fontSize: 20,
        color: '#989899',
        marginTop: 20
    },
    phoneNumberView: {
        marginTop: 50,
        flexDirection: 'row',
        height: 60,
        borderWidth: 1,
        borderRadius: 50,
        alignItems: 'center',
        borderColor: '#989899'
    },
    countryCodeView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    countryCodeText: {
        borderColor: '#989899',
        borderRightWidth: 1,
        marginLeft: 10,
        fontSize: 15,
    },
    verticleLine: {
        borderColor: '#989899',
        borderRightWidth: 1,
        height: 30
    },
    inputView: {
        width: width - (40 + 60 + 60),
        marginLeft: 10
    },
    iconView: {
        width: 60
    },
    phoneInput: {
        width: '100%'
    },
    buttonView: {
        height: 50,
        width: width - 80,
        marginTop: 80,
        alignSelf: 'center',
        borderRadius: 4,
        backgroundColor: '#19191E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18
    }


});

