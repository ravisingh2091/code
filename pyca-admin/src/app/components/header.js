import React from 'react'
import '../App.css';

const header = (props) => {
    const logout = () => {
        localStorage.clear();
        window.location.assign("/");
    }
    return <header>
        <div className="Header">
            <div className="Logo">
                <figure><img src={require("../../assets/images/Logo.png")} /></figure>
            </div>
            <div className="Navigation">
                <div className="Avater">
                    <a href="#">
                        <figure><img src={require("../../assets/images/profile.jpg")} /></figure>
                        Bob Hyden
                <   /a>
                    <ul>
                            <li>
                                <figure><img src={require("../../assets/images/profile.jpg")} /></figure>
                                <h4> Bob Hyden <span>Administrator</span></h4>
                            </li>
                            <li>
                                <button onClick={logout} ><i className="fa fa-sign-out"></i>Logout</button >
                            </li>
                        </ul>
                </div>

                    <div className="clear"></div>
                </div>

                <div className="clear"></div>
            </div>
    </header>
}
export default header