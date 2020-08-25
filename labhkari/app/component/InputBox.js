import React from 'react'
import { View, Image, TextInput, TouchableOpacity, StyleSheet ,Text} from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import { colors, localImages , fonts} from '../utils/constant'

import * as Animatable from 'react-native-animatable';


export default (props) => {
    return (
        <View
            style={{
                ...styles.card,
                width: props.width,
                marginTop: props.marginTop,
                flexDirection: 'row',
                backgroundColor: props.backgroundColor,
                alignItems: 'center',
            }}
        >
            <TextInput
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderColor}
                secureTextEntry={props.secureTextEntry}
                editable={props.editable}
                value={props.value}
                multiline={props.multiline ? props.multiline : false}
                maxLength={props.maxLength}
                onChangeText={(text) => props.onChangeText(text)}
                keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                style={{
                    width: props.width - 30,
                    borderRadius: 8,
                    color: props.inputTextColor,
                    height: props.height
                }}>
            </TextInput>
            {
                props.iconName ? <TouchableOpacity onPress={() => props.onIconClick()}>
                    <Image
                        source={localImages[props.iconName]}
                        style={{ height: 20, width: 20, marginRight: 5 }}
                    />
                </TouchableOpacity> : null
            }
        </View >
    )
}

export const OtpBox = (props) => {
    return (
        <SmoothPinCodeInput
            containerStyle={{ alignSelf: 'center' }}
            cellSpacing={30}
            cellSize={60}
            password={false}
            cellStyle={{
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: colors.inputBox,
                borderColor: colors.backText,
                shadowColor: '#000',
                shadowOffset: {
                    width: 2,
                    height: 4,
                },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,
                elevation: 8,
                marginTop: 40
            }}
            cellStyleFocused={{
                borderBottomWidth: 1.5,
                borderColor: colors.ornageButton,
            }}
            textStyle={{
                color: colors.backText,
                fontSize: 20
            }}
            autoFocus
            placeholder={''}
            value={props.value}
            onTextChange={(text) => props.onChangeText(text)}
        />
    )
}

export const ErrorMsg = (props) => {
    return (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.textLine}>{props.message}</Text>
        </Animatable.View>
    )
}

export const InputViewBox= (props) => {
    return (
        <View
            style={{
                ...styles.card,
                width: props.width,
                marginTop: props.marginTop,
                flexDirection: 'row',
                backgroundColor: props.backgroundColor,
                alignItems: 'center',
                justifyContent:'center',
            }}
        >
            <TouchableOpacity
                onPress={() => props.onViewClick()}
                
                style={{
                    width: props.width - 30,
                    justifyContent:'center',
                    borderRadius: 8,
                    color: props.inpOuTouchableOpacityColor,
                    height: props.height,
                    color:props.placeholderColor
                }}>
                  <Text  style={{
                    
                   
                   
                    color:props.placeholderColor
                }}>{props.value?props.value:props.placeholder} </Text> 
            </TouchableOpacity>
            {
                props.iconName ? <TouchableOpacity onPress={() => props.onIconClick()}>
                    <Image
                        source={localImages[props.iconName]}
                        style={{ height: 20, width: 20, marginRight: 5 }}
                    />
                </TouchableOpacity> : null
            }
        </View >
    )
}

var styles = StyleSheet.create({
    card: {
        backgroundColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        justifyContent: 'center',
        borderRadius: 8

    },
    button: {

        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textLine: {
        color: colors.red,
        fontSize: 17,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.regular,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? 'normal' : null
    },

});