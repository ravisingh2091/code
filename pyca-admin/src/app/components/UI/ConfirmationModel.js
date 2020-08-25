import React from 'react'

const ConfirmationModel = (props) => {


    return (<div className="ModalBox">
        <div className="Modalwrapper">
            <div className="Modalbackdrop" onClick={props.modelClose}></div>
            <div className="Modalcontent">
                <span className="CloseModal" onClick={props.modelClose}>×</span>
                <div className="Decline">
                    {props.children}
                </div>
                <h4>
                    <span onClick={props.modelClose} >No</span>
                    <span onClick={props.userConfirm}>Yes</span>
                </h4>
            </div>
        </div>
    </div>);
}

export default ConfirmationModel