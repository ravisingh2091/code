import React, { Component } from 'react';
import Snackbar from 'react-native-snackbar';

class SharedClass extends Component {

    ShowSnakBar({ message, type, delay = 500 }) {
        setTimeout(() => {
            Snackbar.show({
                text: message,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: type == 'success' ? "#3c763d" : "#FF0000",
            });
        }, delay)
    }


}
export default SharedClass

