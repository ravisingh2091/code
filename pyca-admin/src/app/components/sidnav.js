import React, { useState, useEffect } from 'react'
import '../App.css';
import { NavLink, withRouter } from "react-router-dom";


const Sidnav = (props) => {
    const [menuData, setMenuData] = useState({ member: '', ride: '', query: '', schedule: '' })
    useEffect(() => {
        if (
            props.location.pathname === "/member_list" ||
            props.location.pathname === "/member_approve" ||
            props.location.pathname === "/member_pending" ||
            props.location.pathname === "/member_block"
        ) {
            setMenuData({
                ride: '',
                query: '',
                schedule: '', member: menuData.member ? '' : ' active'
            })
        }
    }, []);
    const logout = () => {
        localStorage.clear();
        window.location.assign("/");
    }

    const menuToggle = (menu) => {
        switch (menu) {
            case 'member':
                setMenuData({
                    ride: '',
                    query: '',
                    schedule: '',
                    member: menuData.member ? '' : ' active'
                })
                break;
            case 'ride':
                setMenuData({
                    member: '',
                    query: '',
                    schedule: '',
                    ride: menuData.ride ? '' : ' active'
                })
                break;
            case 'schedule':
                setMenuData({
                    member: '',
                    ride: "",
                    query: '',
                    schedule: menuData.schedule ? '' : ' active'
                })
                break;
            case 'query':
                setMenuData({
                    member: '',
                    schedule: '',
                    ride: "",
                    query: menuData.query ? '' : ' active',
                })
                break;
        }
    }
    return <div className="SidenavBar">
        <ul>
            <li>
                <NavLink to="/dashboard" exact>
                    <span><i className="fa fa-tachometer" aria-hidden="true"></i>  </span>
                    Dashboard
                </NavLink>
            </li>
            <li className={'dropdown ' + menuData.member} onClick={() => menuToggle('member')}>
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <span> <i className="fa fa-user"></i></span>
                    Member Management
                </a>
                <ul className="dropdown-menu">
                    <li>
                        <NavLink to="/member_list" exact>Members List</NavLink>
                    </li>

                    <li>
                        <NavLink to="/member_approve" exact>Approve Members</NavLink>
                    </li>

                    <li>
                        <NavLink to="/member_pending">Pending Members</NavLink>
                    </li>

                    <li>
                        <NavLink to="/member_block">Block members</NavLink>
                    </li>
                </ul>
            </li>
            <li className={'dropdown ' + menuData.ride} onClick={() => menuToggle('ride')}>
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <span> <i className="fa fa-car"></i></span>
                    Ride Management
                </a>
                <ul className="dropdown-menu">
                    <li>
                        <a href="ride-active.html">Active ride</a>
                    </li>

                    <li>
                        <a href="ride-complete.html">Completed ride</a>
                    </li>
                </ul>
            </li>
            <li className={'dropdown ' + menuData.schedule} onClick={() => menuToggle('schedule')}>
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <span> <i className="fa fa-calendar-check-o"></i></span>
                    Schedules Management
                </a>
                <ul className="dropdown-menu">
                    <li>
                        <a href="schedule-list.html">Schedules Rides</a>
                    </li>

                    <li>
                        <a href="schedule-carpooling.html">Schedule Offered Rides</a>
                    </li>
                </ul>
            </li>
            <li className={'dropdown ' + menuData.query} onClick={() => menuToggle('query')}>
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <span> <i className="fa fa-paper-plane"></i></span>
                    Queries Management
                </a>
                <ul className="dropdown-menu">
                    <li>
                        <NavLink to="/reason">Add reason</NavLink>
                    </li>

                    <li>
                        <NavLink to="/queries">Queries</NavLink>
                    </li>
                </ul>
            </li>

            <li>
                <NavLink to="/setting">
                    <span> <i className="fa fa-cog"></i> </span>
                    change settings
            </NavLink>
            </li>
            <li>
                <NavLink to="/content">
                    <span> <i className="fa fa-font"></i> </span>
                    Content management
            </NavLink>
            </li>
            <li>
                <a href="#" onClick={logout}>
                    <span ><i className="fa fa-sign-out"></i> </span>
                    Logout
                </a>
            </li>
        </ul>
    </div>
}
export default withRouter(Sidnav)