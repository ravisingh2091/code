import React from 'react'
import '../App.css';
import { toast } from 'react-toastify';

import Layout from '../hoc/layout/layout';
import axios from './../axios'
import MemberListTdTr from '../components/UI/MemberListTdTr'
import Pagination from '../components/UI/Pagination'
import Loading from '../components/UI/Loading'
import ConfirmationModel from '../components/UI/ConfirmationModel'


class MemberApprove extends React.Component {
    state = {
        userList: [],
        totalUser: 0,
        loader: false,
        currentPage: 1,
        showMode: false,
        userId: null,
    }
    componentDidMount() {
        this.getMemeberList(this.state.currentPage);
    }

    getMemeberList = (pageNo) => {
        this.setState({
            ...this.setState,
            loader: true
        })
        axios.get(`/admin/userList?list=approved&page=${pageNo}`)
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

    showMode = (id) => {
        this.setState({
            ...this.state,
            showMode: true,
            userId: id
        })
    }
    userConfirm = () => {
        let userId = this.state.userId;
        this.setState({
            ...this.setState,
            loader: true
        })
        // user block and unbock request to server
        if (userId) {
            axios.put(`/admin/userStatusManage?userId=${userId}`, { adminApproved: '0' })
                .then(result => {
                    if (result.data.status == "success") {
                        // update user state 
                        this.setState({
                            ...this.setState,
                            loader: false,
                            showMode: false,
                            userId: null,
                            userList: this.state.userList.filter(it => it._id != userId)
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
            page="approve"
            showModel={id => this.showMode(id)}
        />)
        return <Layout >
            <Loading loader={this.state.loader} />
            {this.state.showMode ? <ConfirmationModel modelClose={this.modelClose} userConfirm={this.userConfirm}>
                <h3 >Refuse</h3>
                <p>Are you sure you want to refuse this member?</p>
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
        </Layout>
    }
}
export default MemberApprove