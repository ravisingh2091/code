import { Dimensions, StyleSheet, Platform } from 'react-native';
import { colors, fonts, localImages } from '../../utils/constant'
import { CustomStyles } from './CustomStyles';
const { height } = Dimensions.get('window');
export const DrawerStyles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.authBackGroud,
        height: height
    },

    imageView: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 110,
        width: 110,
        borderRadius: 55,
        borderColor: '#fff',
        borderWidth: 5,
        marginTop: -130,
        overflow: 'hidden'
    },
    image: {
        height: 110,
        width: 110,
    },
    navContainer: {
        marginTop: 20,
        marginLeft: 20
    },
    nameText: {
        ...CustomStyles.textLine,
        textAlign: 'center',
        color: colors.backText,
        marginTop: 5,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null
    }
})