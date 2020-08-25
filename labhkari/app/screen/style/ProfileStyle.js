import { StyleSheet, Dimensions } from "react-native";
import { colors, fonts } from "../../utils/constant";
const { height } = Dimensions.get('window')

export default StyleSheet.create({
    content: {
        marginTop: 70,
        backgroundColor: colors.white,
        height: height * .42,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileContainer: {
        height: 120,
        width: 120,
        borderRadius: 60,
        marginTop: -65,
        alignSelf: 'center',
        borderColor: colors.authBackGroud,
        borderWidth: 7,
        overflow: "hidden",
    },
    textStyle: {
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null
    },
    editImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    }
})