import React from 'react'
import '../App.css';
import Layout from '../hoc/layout/layout';


class dashboard extends React.Component {
    render() {
        return <Layout>
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">

                        <div className="HelpArea">

                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#About">About us</a></li>
                                <li><a data-toggle="tab" href="#Service">Terms of Service</a></li>
                            </ul>

                            <div className="tab-content">
                                <div id="About" className="tab-pane fade in active">
                                    <a href=";" className="Edit">Edit</a>

                                    <h3>About us</h3>

                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>

                                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. </p>

                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>

                                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>

                                    <p> I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. </p>

                                </div>

                                <div id="Service" className="tab-pane fade">
                                    <a href=";" className="Edit">Edit</a>

                                    <h3>Terms of Service</h3>

                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>

                                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. </p>

                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>

                                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>

                                    <p> I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. </p>

                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="ModalBox">
                <div id="DeleteModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <a href=";" className="CloseModal" data-dismiss="modal">&times;</a>
                                <h3>Delete</h3>
                                <p>Are you sure you want to delete this item?</p>
                                <h4>
                                    <a href=";" data-dismiss="modal">no</a>
                                    <a href=";" data-dismiss="modal">Yes</a>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="EditModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">

                                <a href=";" className="CloseModal" data-dismiss="modal">&times;</a>
                                <div className="Category">
                                    <h3>Edit FAQ</h3>
                                    <div className="form-group">
                                        <label>Question</label>
                                        <input type="text" className="form-control" value="How do I download the app ?" onChange={() => null} />
                                    </div>
                                    <div className="form-group">
                                        <label>Answer</label>
                                        <textarea rows="8" className="form-control" onChange={() => null} defaultValue="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga."></textarea>
                                    </div>
                                    <button>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    }
}
export default dashboard