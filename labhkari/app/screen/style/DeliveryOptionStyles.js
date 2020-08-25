import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../utils/constant'

export default StyleSheet.create({
    contentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 15
    },
    nameText: {
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        fontSize: 16,
        color: colors.backText,
        marginTop: -5,
        marginBottom: 5
    },
    addressText: {
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        color: colors.backText,
        marginBottom: 5,
        color: colors.grayColor
    },
    phoneText: {
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        color: colors.backText,
        marginBottom: 5,
        color: colors.grayColor
    },
    changeAddText: {
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        fontSize: 14,
        color: colors.ornageButton,
        textDecorationLine: 'underline'
    },
    selectYourText: {
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10
    },
    continueView: {
        position: 'absolute',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        bottom: 0,
        backgroundColor: colors.white
    },
    amount: {
        alignSelf: 'center',
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        fontSize: 28,
    }

})