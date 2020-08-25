import React from 'react'
import '../App.css';

import Layout from '../hoc/layout/layout';

class dashboard extends React.Component {
    render() {
        console.log(this.props)
        return <Layout>
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                        <h4 className="Title">Quries </h4>

                        <div className="TableList">
                            <table>
                                <tr>
                                    <th>S.No</th>
                                    <th>User name</th>
                                    <th>Reason</th>
                                    <th>User Email</th>
                                    <th>Contact</th>
                                    <th>Message </th>
                                    <th>Reply</th>
                                </tr>

                                <tr>
                                    <td>1.</td>
                                    <td>Ankit</td>
                                    <td>Reason</td>
                                    <td>ankit@gmail.com</td>
                                    <td>9876543210</td>
                                    <td>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </td>
                                    <td><a href=";" data-toggle="modal" data-target="#ReplyModal">Reply</a></td>
                                </tr>

                                <tr>
                                    <td>2.</td>
                                    <td>Sunil</td>
                                    <td>Reason</td>
                                    <td>sunil@gmail.com</td>
                                    <td>9876543210</td>
                                    <td>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</td>
                                    <td><a href=";" data-toggle="modal" data-target="#ReplyModal">Reply</a></td>
                                </tr>

                                <tr>
                                    <td>3.</td>
                                    <td>Sudhanshu</td>
                                    <td>Reason</td>
                                    <td>Sudhanshu@gmail.com</td>
                                    <td>9876543210</td>
                                    <td>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</td>
                                    <td><a href=";" data-toggle="modal" data-target="#ReplyModal">Reply</a></td>
                                </tr>

                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </Layout>
    }
}
export default dashboard