import React, { Component } from 'react'

import '../App.css';
import Layout from '../hoc/layout/layout';
import DashboardCard from '../components/UI/dashboardCard'

class Dashboard extends Component {
    render() {
        return <Layout>
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="DashboardArea">
                        <h2>Dashboard</h2>
                        <ul>
                            <DashboardCard title="Booked Trips" increasedBy="10" number="5,000" iconClass="fa-car" />
                            <DashboardCard title="New Users" increasedBy="10" number="52" iconClass="fa-user" />
                            <DashboardCard title="Booked Trips" increasedBy="10" number="1,000" iconClass="fa-map" />
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    }
}
export default Dashboard