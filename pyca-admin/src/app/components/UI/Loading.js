import React from "react";

const Loading = ({ loader }) => {
    let loaderDiv = null
    if (loader) {
        loaderDiv = <div id="loaddingLoader" >
            <div className="loaderSpinner" ></div>
            <br />Loading...
        </div >
    }
    return loaderDiv
}


export default Loading