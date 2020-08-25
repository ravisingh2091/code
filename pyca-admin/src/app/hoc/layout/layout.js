import React from 'react'

import Header from './../../components/header'
import Sidnav from './../../components/sidnav'

const layout = (props) => {
    return (
        <React.Fragment>
            <Header />
            <Sidnav />
            {props.children}
        </React.Fragment>
    );
}

export default layout