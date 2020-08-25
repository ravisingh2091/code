import { StyleSheet } from 'react-native';
import { colors } from '../../utils/constant'
import { CustomStyles } from './CustomStyles';

export const NotificationStyles = StyleSheet.create({
    contentView: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 5,
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
        marginTop: 5,
        marginHorizontal: 10,
        color: colors.backText,
    },
    time: {
        color: colors.grayColor,
        fontSize: 12,
        alignSelf: 'flex-end',
        marginBottom: 5,
        marginRight: 10
    }
})