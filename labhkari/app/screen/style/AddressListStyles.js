import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts } from '../../utils/constant'

export default StyleSheet.create({
    contentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        padding: 10,
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
    addAddress: {
        position: 'absolute',
        right: 15,
        bottom: 15,
    }

})