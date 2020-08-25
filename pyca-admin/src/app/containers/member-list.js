import React from 'react'
import '../App.css';
import { toast } from 'react-toastify';

import Layout from '../hoc/layout/layout';
import axios from './../axios'
import MemberListTdTr from '../components/UI/MemberListTdTr'
import Pagination from '../components/UI/Pagination'
import Loading from '../components/UI/Loading'
import ConfirmationModel from '../components/UI/ConfirmationModel'


class MemberList extends React.Component {
    state = {
        userList: [],
        totalUser: 0,
        loader: false,
        currentPage: 1,
        showMode: false,
        userId: null,
        userConfirmStatus: null
    }
    componentDidMount() {
        this.getMemeberList(this.state.currentPage);
    }

    getMemeberList = (pageNo) => {
        this.setState({
            ...this.setState,
            loader: true
        })
        axios.get(`/admin/userList?list=all&page=${pageNo}`)
            .then(userList => {
                if (userList.data.status == "success") {
                    this.setState(
                        {
                            ...this.state,
                            userList: userList.data.details[0].totalData,
                            totalUser: userList.data.details[0].totalCount[0].count,
                            loader: false
                        }
                    )
                }
            }).catch(error => {
                console.log({ error })
                this.setState({
                    ...this.setState,
                    loader: false
                })
                if (error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);

                }

            })
    }

    pageLinkClick = (pageNo) => {
        this.getMemeberList(pageNo);
        this.setState({
            ...this.state,
            currentPage: pageNo
        })
    }

    modelClose = () => {
        this.setState({
            ...this.state,
            showMode: false
        })
    }

    showMode = (id, status) => {
        this.setState({
            ...this.state,
            showMode: true,
            userId: id,
            userConfirmStatus: status
        })
    }
    userConfirm = () => {
        let userId = this.state.userId;
        let userConfirmStatus = this.state.userConfirmStatus;
        this.setState({
            ...this.setState,
            loader: true
        })
        // user block and unbock request to server
        if (userId && userConfirmStatus) {
            axios.put(`/admin/userStatusManage?userId=${userId}`, { status: userConfirmStatus })
                .then(result => {
                    if (result.data.status == "success") {
                        // update user state 
                        let localIndex = this.state.userList.map(it => {
                            return it._id
                        }).indexOf(userId)

                        const userDetails = this.state.userList;
                        userDetails[localIndex].status = userConfirmStatus
                        this.setState({
                            ...this.setState,
                            loader: false,
                            showMode: false,
                            userId: null,
                            userConfirmStatus: null,
                            userList: userDetails
                        })
                    }
                }).catch(error => {
                    console.log({ error })
                    this.setState({
                        ...this.setState,
                        loader: false
                    })
                    if (error.response.data) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error(error.message);

                    }

                })
        }
    }


    render() {
        let userTdTr = this.state.userList.map((value, index) => <MemberListTdTr
            value={value}
            key={value._id}
            srNumber={index + 1 + (this.state.currentPage - 1) * 10}
            page="list"
            showModel={(id, status) => this.showMode(id, status)}
        />)
        return <Layout >
            <Loading loader={this.state.loader} />
            {this.state.showMode ? <ConfirmationModel modelClose={this.modelClose} userConfirm={this.userConfirm}>
                {
                    this.state.userConfirmStatus == '0' ? <div>
                        <h3 >Block</h3>
                        <p>Are you sure you want to block this member?</p>
                    </div>
                        : <div>
                            <h3 >UnBlock</h3>
                            <p>Are you sure you want to Unblock this member?</p>
                        </div>
                }
            </ConfirmationModel>
                : null
            }
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                        <h4 className="Title">Members List</h4>
                        <div className="TableList">
                            <table>
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Email Address</th>
                                        <th>phone number</th>
                                        <th>Vehicle Number</th>
                                        {/* <th>Trips</th> */}
                                        <th>status</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userTdTr}
                                </tbody>
                            </table>
                        </div>

                        <Pagination totalData={this.state.totalUser} currentPage={this.state.currentPage} pageLinkClick={this.pageLinkClick} />

                    </div>
                </div>
            </div >
        </Layout >
    }
}
export default MemberList