import React from 'react'

const dashboardCard = ({ title, increasedBy, number, iconClass }) => {
    return (<li>
        <div className="DashboardBox">
            <span className="Icon"><i className={'fa ' + iconClass}></i></span>
            <h3>{title}</h3>
            <h4>{number}</h4>
            <h5>Increased by {increasedBy}%</h5>
        </div>
    </li>);
}


export default dashboardCard