import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, Image, TouchableOpacity, Text } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';

import axios from '../../api'
import { userUpdate, exitToExplore } from './../../redux/actions/AllAction'
import Button, { HeaderWithDrawer } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'
import ProfileStyle from './../style/ProfileStyle'
import InputBox, { ErrorMsg } from '../../component/InputBox';
import Loder from '../../utils/Loder'

const { height, width } = Dimensions.get('window')

const ProfileScreen = (props) => {
    const { isGaust, navigation, userUpdate, exitToExplore, user } = props



    const [buttonLabel, setButtonLabel] = useState("EDIT PROFILE")
    const [editedMode, setEditedMode] = useState(false)
    const [name, setName] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
    const [image, setImage] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
    })
    const chooseFile = () => {
        if (editedMode) {
            let options = {
                title: 'Select Image',
                quality: .5,
                maxWidth: 500,
                maxHeight: 500,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            ImagePicker.showImagePicker(options, response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else {
                    response.data = undefined
                    setImage(response)
                    console.log(response)
                }
            });
        }

    };

    const onUpdate = async () => {

        if (!editedMode) {
            setButtonLabel("UPDATE")
            setEditedMode(true)
        } else {
            try {
                setLoading(true)
                let formData = new FormData()
                formData.append('name', name)
                formData.append('email', email)
                formData.append('address', user.address)
                formData.append('latitude', user.location.coordinates[1])
                formData.append('longitude', user.location.coordinates[0])
                if (image) {
                    formData.append("profilePic", {
                        name: image.fileName,
                        type: image.type,
                        uri: image.uri
                    })

                }
                let response = await axios.post('user/userUpdateDetails', formData, {
                    headers: { 'content-type': 'multipart/form-data' }
                })
                setLoading(false)

                if (response && response.data.status == 200) {
                    userUpdate(response.data.data)
                    setEditedMode(false)
                    setButtonLabel('EDIT PROFILE')
                } else {
                    setError(response.data.message)
                }

            } catch (error) {
                setLoading(false)
                console.error("API ERROR", { error })
            }
        }
    }

    const profileData = (image, label, text) => {
        return <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
            <Image
                style={{ height: 30, width: 30 }}
                source={image}
            />

            {
                label === 'Phone'
                    ? <TouchableOpacity onPress={() => navigation.navigate('ChangePhoneScreen')} style={{ marginLeft: 10 }}>
                        <Text style={{ ...ProfileStyle.textStyle, fontSize: 12, color: colors.grayColor }}>{label}</Text>
                        <Text style={{ ...ProfileStyle.textStyle, fontSize: 14, color: colors.backText }}>{text}</Text>
                    </TouchableOpacity>
                    : <View style={{ marginLeft: 10 }}>
                        <Text style={{ ...ProfileStyle.textStyle, fontSize: 12, color: colors.grayColor }}>{label}</Text>
                        <Text style={{ ...ProfileStyle.textStyle, fontSize: 14, color: colors.backText }}>{text}</Text>
                    </View>
            }

        </View>
    }

    if (isGaust) {
        exitToExplore();
        return null
    }

    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithDrawer
                    onActionLeft={() => navigation.openDrawer()}
                    label="Profile"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />

                <View style={ProfileStyle.content}>
                    <View style={ProfileStyle.profileContainer}>
                        <TouchableOpacity onPress={() => chooseFile()}>
                            <Image
                                style={{ height: 120, width: 120 }}
                                source={{ uri: image ? image.uri : user?.profilePic }}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        editedMode
                            ? <View style={{ alignItems: 'center' }}>
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
                                        setName(text)
                                    }}
                                />

                                <InputBox
                                    height={60}
                                    backgroundColor={colors.inputBox}
                                    width={(width - 60)}
                                    borderRadius={30}
                                    marginTop={20}
                                    placeholder="Email"
                                    label="Email"
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
                                        setEmail(text)
                                    }}
                                />
                                {error ? <ErrorMsg message={error} /> : null}
                            </View>
                            : <>
                                {profileData(localImages.useraa, 'Name', user?.name)}

                                {profileData(localImages.email_s, 'Email', user?.email)}
                            </>
                    }
                    {profileData(localImages.call_s, 'Phone', user?.countryCode + user?.mobileNumber)}
                    {/* {profileData(localImages.email_s, 'Email', user?.email)} */}
                    {/* {profileData(localImages.location_s, 'Location', user?.address)} */}

                </View>
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Button
                        height={60}
                        backgroundColor={colors.inputBox}
                        width={width - 130}
                        borderRadius={8}
                        marginTop={50}
                        label={buttonLabel}
                        labelColor={colors.ornageButton}
                        onAction={() => onUpdate()}
                        fontSize={17}
                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                        fontWeight={Platform.OS == 'ios' ? '700' : null}
                    />
                </View>
            </SafeAreaView>
        </View>
    </>

}


const mapStateToProps = (state) => {
    return {
        isGaust: state.auth.isGaust,
        user: state.auth.user,
    };
}
const mapDispatchToProps = dispatch => {
    return {
        userUpdate: (user) => {
            dispatch(userUpdate(user))
        },
        exitToExplore: () => {
            dispatch(exitToExplore())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)