import React, { useState } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions } from 'react-native'
import { connect } from 'react-redux';

import axios from '../../api'
import { exitToExplore } from './../../redux/actions/AllAction'
import SharedClass from '../../utils/SharedClass'
import Button, { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import InputBox, { ErrorMsg } from '../../component/InputBox'
import Loder from '../../utils/Loder'

const { width } = Dimensions.get('window')

const ChangePasswordScreen = (props) => {
    const { navigation, isGaust, exitToExplore } = props
    const sharedClass = new SharedClass()

    const [loading, setLoading] = useState(false)
    const [secureTextEntry, setSecureTextEntry] = useState({
        oldPassword: true,
        newPassword: true,
        confirmPassword: true
    })

    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [errors, setError] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })


    const onSubmit = async () => {
        const { oldPassword, newPassword, confirmPassword } = password

        setError({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        })

        if (!oldPassword.trim()) {
            setError({
                oldPassword: 'Old Password is invalid/required',
            })
            return
        }

        if (!newPassword.trim() || newPassword.length < 6) {
            setError({
                newPassword: 'Password is invalid/required/greter then 6 letter',
            })
            return
        }
        if (newPassword.trim() != confirmPassword.trim()) {
            setError({
                confirmPassword: 'Confirm Password must same',
            })
            return
        }


        try {
            setLoading(true)
            let response = await axios.post('user/changePassword', { oldPassword, newPassword })
            setLoading(false)
            if (response && response.data.status == 200) {
                setPassword({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })

                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'success',
                    delay: 300
                })
            } else {
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }

        } catch (error) {
            setLoading(false)
            console.error({ error })
        }

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
                <HeaderWithBack
                    onActionLeft={() => navigation.goBack()}
                    label="Change Password"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <InputBox
                        height={60}
                        backgroundColor={colors.inputBox}
                        width={(width - 40)}
                        borderRadius={30}
                        marginTop={15}
                        placeholder="Old Password"
                        placeholderColor={colors.placeHolderColor}
                        inputTextColor={colors.inputTextColor}
                        editable={true}
                        maxLength={400}
                        secureTextEntry={secureTextEntry?.oldPassword}
                        onIconClick={() => setSecureTextEntry({
                            ...secureTextEntry,
                            'oldPassword': !secureTextEntry.oldPassword
                        })}
                        iconName="eye"
                        value={password?.oldPassword}
                        onChangeText={(text) => setPassword({ ...password, 'oldPassword': text })}
                    />
                    {errors.oldPassword ? <ErrorMsg message={errors.oldPassword} /> : null}
                    <InputBox
                        height={60}
                        backgroundColor={colors.inputBox}
                        width={(width - 40)}
                        borderRadius={30}
                        marginTop={20}
                        placeholder="New Password"
                        placeholderColor={colors.placeHolderColor}
                        inputTextColor={colors.inputTextColor}
                        editable={true}
                        maxLength={400}
                        secureTextEntry={secureTextEntry?.newPassword}
                        onIconClick={() => setSecureTextEntry({
                            ...secureTextEntry,
                            'newPassword': !secureTextEntry.newPassword
                        })}
                        iconName="eye"
                        value={password?.newPassword}
                        onChangeText={(text) => setPassword({ ...password, 'newPassword': text })}
                    />
                    {errors.newPassword ? <ErrorMsg message={errors.newPassword} /> : null}
                    <InputBox
                        height={60}
                        backgroundColor={colors.inputBox}
                        width={(width - 40)}
                        borderRadius={30}
                        marginTop={20}
                        placeholder="Confirm Password"
                        label="Confirm Password"
                        labelColor={colors.labelColor}
                        placeholderColor={colors.placeHolderColor}
                        inputTextColor={colors.inputTextColor}
                        editable={true}
                        maxLength={400}
                        secureTextEntry={secureTextEntry?.confirmPassword}
                        onIconClick={() => setSecureTextEntry({
                            ...secureTextEntry,
                            'confirmPassword': !secureTextEntry.confirmPassword
                        })}
                        iconName="eye"
                        value={password?.confirmPassword}
                        onChangeText={(text) => setPassword({ ...password, 'confirmPassword': text })}
                    />
                    {errors.confirmPassword ? <ErrorMsg message={errors.confirmPassword} /> : null}
                    <Button
                        height={60}
                        backgroundColor={colors.ornageButton}
                        width={width - 130}
                        borderRadius={8}
                        marginTop={20}
                        label="Submit"
                        labelColor={colors.inputBox}
                        onAction={() => onSubmit()}
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
        isGaust: state.auth.isGaust
    };
}
const mapDispatchToProps = dispatch => {
    return {
        exitToExplore: () => {
            dispatch(exitToExplore())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen)