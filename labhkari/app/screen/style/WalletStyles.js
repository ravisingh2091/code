import { Dimensions, StyleSheet, Platform } from 'react-native';
import { colors, fonts, localImages } from '../../utils/constant'
import { CustomStyles } from './CustomStyles';
const { height } = Dimensions.get('window');
export const WalletStyles = StyleSheet.create({
    headerImage: {
        height: height / 3,
        width: '100%',
    },

    pointView: {
        backgroundColor: colors.ornageButton,
        height: 140,
        width: 140,
        borderRadius: 70,
        borderWidth: 8,
        borderColor: colors.authBackGroud,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: -125,
    },
    pointNumber: {
        ...CustomStyles.textLine,
        margin: 0,
        fontSize: 50,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        color: '#fff'
    },
    contentView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 5,
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    titleText: {
        ...CustomStyles.textLine,
        marginTop: 0,
        color: colors.backText,
        flex: 1
    },
    pointText: {
        fontSize: 18,
        color: colors.ornageButton,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null
    }
})