import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../utils/constant';

export default StyleSheet.create({
    modalContent: {
        backgroundColor: '#f6f8f9',
        justifyContent: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: '80%',
        minHeight: 300,
    },
    headerText: {
        color: colors.placeHolderColor,
        fontSize: 19,
        alignSelf: 'center',
        marginLeft: 10
    },
    closeImage: {
        width: 20,
        height: 20,
        right: 5,
        top: 5
    },
    flatListText: {
        color: colors.backText,
        fontSize: 13.6,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null,
        marginLeft: 10
    }
})
