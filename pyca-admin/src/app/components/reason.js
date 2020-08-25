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
                        <div className="TableList">

                            <h4 className="Title">Reason <a href=";" data-toggle="modal" data-target="#AddModal">Add New Reason</a></h4>

                            <table>
                                <tr>
                                    <th>S.No</th>
                                    <th>Reasons</th>
                                    <th>action</th>
                                </tr>

                                <tr>
                                    <td>1</td>
                                    <td>Morbi sed nisl a mi commodo convallis.</td>
                                    <td>
                                        <a className="Red" title="Category Delete" href=";" data-toggle="modal" data-target="#DeleteModal"><i className="fa fa-trash"></i></a>
                                        <a className="Green" title="Category Edit" href=";" data-toggle="modal" data-target="#EditModal"><i className="fa fa-pencil-square-o"></i></a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>2</td>
                                    <td>Praesent auctor urna id faucibus pretium.</td>
                                    <td>
                                        <a className="Red" title="Category Delete" href=";" data-toggle="modal" data-target="#DeleteModal"><i className="fa fa-trash"></i></a>
                                        <a className="Green" title="Category Edit" href=";" data-toggle="modal" data-target="#EditModal"><i className="fa fa-pencil-square-o"></i></a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>3</td>
                                    <td>Nullam mattis libero a pharetra feugiat.</td>
                                    <td>
                                        <a className="Red" title="Category Delete" href=";" data-toggle="modal" data-target="#DeleteModal"><i className="fa fa-trash"></i></a>
                                        <a className="Green" title="Category Edit" href=";" data-toggle="modal" data-target="#EditModal"><i className="fa fa-pencil-square-o"></i></a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>4</td>
                                    <td>Nulla aliquet orci eu placerat luctus.</td>
                                    <td>
                                        <a className="Red" title="Category Delete" href=";" data-toggle="modal" data-target="#DeleteModal"><i className="fa fa-trash"></i></a>
                                        <a className="Green" title="Category Edit" href=";" data-toggle="modal" data-target="#EditModal"><i className="fa fa-pencil-square-o"></i></a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>5</td>
                                    <td>In et libero non sapien consectetur tempor.</td>
                                    <td>
                                        <a className="Red" title="Category Delete" href=";" data-toggle="modal" data-target="#DeleteModal"><i className="fa fa-trash"></i></a>
                                        <a className="Green" title="Category Edit" href=";" data-toggle="modal" data-target="#EditModal"><i className="fa fa-pencil-square-o"></i></a>
                                    </td>
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