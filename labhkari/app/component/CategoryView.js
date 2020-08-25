import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

import { colors, fonts, localImages } from '../utils/constant'
const { width } = Dimensions.get('window');

const CategoryView = (props) => {
    return (
        <View style={{ width: width / 3, alignItems: 'center' }} >
            <TouchableOpacity onPress={() => props.onSelectCate()}>
                <Image
                    source={{ uri: props.categoryData.image }}
                    style={{ ...styles.categoryView, resizeMode: 'cover', maxWidth: width / 3 }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{ ...styles.categoryButton, backgroundColor: props.styleData.backgroundColor }}
                onPress={() => props.onSelectCate()}
            >
                <Text style={{ ...styles.nameText, color: props.styleData.color }}>
                    {props.categoryData.categoryName ? props.categoryData.categoryName : props.categoryData.subcategoryName}
                </Text>
            </TouchableOpacity>
        </View>
    )
}


export default CategoryView



const styles = StyleSheet.create({
    categoryView: {
        height: width / 3,
        width: width / 3,
        borderRadius: 8,
        resizeMode: 'contain'
    },
    categoryButton: {
        height: 40,
        borderRadius: 8,
        // backgroundColor: colors.ornageButton,
        width: (width / 3) - 30,
        marginTop: -30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameText: {
        textAlign: 'center',
        // color: colors.white,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.regular,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? 'normal' : null
    }
})

