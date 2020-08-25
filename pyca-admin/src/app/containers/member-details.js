import React from 'react'
import '../App.css';
import { toast } from 'react-toastify';
import axios from '../axios'
import Layout from '../hoc/layout/layout';
import Loading from '../components/UI/Loading'

class MemeberDetails extends React.Component {
    state = {
        youthList: [],
        userDetails: null,
        loader: false,

    }
    componentDidMount() {
        // /admin/userDetails?userId=5e551bad83935f72c8cda093
        this.setState({
            ...this.setState,
            loader: true
        })
        axios.get(`/admin/userDetails?userId=${this.props.match.params.id}`)
            .then(result => {
                if (result.data.status == "success") {
                    this.setState({
                        ...this.state,
                        youthList: result.data.details.youthData,
                        userDetails: result.data.details.userData,
                        loader: false
                    })
                }
            })
            .catch(error => {
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
    render() {

        let youthHtml = []
        this.state.youthList.map((youth, index) => (
            youthHtml.push(
                <tr key={youth._id}>
                    <td>{index + 1}</td>
                    <td>{youth.name.capitalize()}</td>
                    <td>{youth.dob}</td>
                    <td>{youth.phone}</td>
                    <td>{youth.gender.capitalize()}</td>
                    <td>{youth.relation.capitalize()}</td>
                </tr>
            )
        ))

        return <Layout>
            <Loading loader={this.state.loader} />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                        <div className="UserArea">
                            <div className="UserHead">
                                <h4 className="Title">User Details</h4>
                                <div className="clear"></div>
                            </div>
                            <div className="UserBody">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="UserBox">
                                            <label>Name</label>
                                            {this.state.userDetails ? <p>{this.state.userDetails.name}</p> : null}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="UserBox">
                                            <label>Email</label>
                                            {this.state.userDetails ? <p>{this.state.userDetails.email}</p> : null}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="UserBox">
                                            <label>Contact Number</label>
                                            {this.state.userDetails ? <p>{this.state.userDetails.phone}</p> : null}
                                        </div>
                                    </div>


                                    <div className="col-sm-6">
                                        <div className="UserBox">
                                            <label>Address</label>
                                            {this.state.userDetails ? <p>{this.state.userDetails.address}</p> : null}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="UserBox">
                                            <label>Vehicle Number</label>
                                            {this.state.userDetails ? <p>{this.state.userDetails.vehicleNumber.toUpperCase()}</p> : null}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="UserBox">
                                            <label>Car Modal Name</label>
                                            {this.state.userDetails ? <p>{this.state.userDetails.carModel.name}</p> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="clear"></div>
                            </div>

                        </div>


                    </div>


                    <div className="Small-Wrapper">
                        <div className="UserArea">
                            <div className="UserHead">
                                <h4 className="Title">Youth Information </h4>
                                <div className="clear"></div>
                            </div>
                            <div className="UserBody">
                                <div className="TableList">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Full Name</th>
                                                <th>Date of Birth</th>
                                                <th>Phone number</th>
                                                <th>Gender</th>
                                                <th>Relationship</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {youthHtml}

                                        </tbody>
                                    </table>
                                </div>
                                <div className="clear"></div>
                            </div>

                        </div>


                    </div>

                </div>
            </div>
        </Layout>
    }
}
export default MemeberDetails