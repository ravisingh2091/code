import { StyleSheet } from 'react-native';
import { colors } from '../../utils/constant'
import { CustomStyles } from './CustomStyles';

export const ConstactUsStyles = StyleSheet.create({
    circleContainer: {
        marginVertical: 15,
        flexDirection: 'column',
        alignItems: 'center'
    },
    circle: {
        backgroundColor: colors.white,
        height: 140,
        width: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    image: {
        height: 80,
        width: 80,
    },
    contactText: {
        ...CustomStyles.textLine,
        color: colors.backText,
        marginTop: 10
    }
})