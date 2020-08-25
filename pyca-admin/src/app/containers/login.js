import React from 'react'
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';
import '../App.css';

import axios from '../axios'
import Loading from '../components/UI/Loading'

const validEmailRegex = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);


class Login extends React.Component {

    constructor(props) {
        super(props);
        const cookie = new Cookies();
        var username = cookie.get('username') === undefined ? "" : cookie.get('username');
        var password = cookie.get('password') === undefined ? "" : cookie.get('password');
        var remember_me = cookie.get('password') === undefined ? false : true;
        this.state = {
            username: username,
            password: password,
            formsInvalid: true,
            showError: false,
            type: 'password',
            loading: false,
            remember_me: remember_me,
            errors: {
                username: 'Email is not valid!',
                password: 'Password must be 8 characters long!'
            },
            loader: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showHide = this.showHide.bind(this);

    }

    showHide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ ...this.state, type: this.state.type === 'input' ? 'password' : 'input' })
    }
    componentDidMount() {
        if (this.state.formsInvalid || !this.state.username || !this.state.password) {
            let formsInvalid = false;
            for (let i = 0; i < 2; i++) {
                let errors = this.state.errors;
                var name = i === 0 ? 'username' : 'password'
                switch (name) {
                    case 'username':
                        errors.username =
                            validEmailRegex.test(this.state.username) ? '' : 'Email is not valid!'; formsInvalid = validEmailRegex.test(this.state.username) ? false : true
                        break;
                    case 'password':
                        errors.password = this.state.password.length < 8 ? 'Password must be 8 characters long!' : ''; formsInvalid = errors.password.length > 0 ? true : false
                        break;
                    default:
                        break;
                }
            }
            this.setState({ ...this.state, formsInvalid: formsInvalid })
        }

    }
    handleChange = prop => event => {
        const name = prop;
        const value = event.target.value;
        let errors = this.state.errors;
        let formsInvalid = false;
        switch (name) {
            case 'username':
                errors.username =
                    validEmailRegex.test(value) ? '' : 'Email is not valid!'; formsInvalid = validEmailRegex.test(value) ? false : true
                break;
            case 'password':
                errors.password = value.length < 8 ? 'Password must be 8 characters long!' : ''; formsInvalid = errors.password.length > 0 ? true : false
                break;
            default:
                break;
        }

        this.setState({ ...this.state, errors, [name]: value });
        this.setState({ formsInvalid: formsInvalid })
    }
    handleCheck = () => {
        this.setState({ ...this.state, remember_me: !this.state.remember_me });
    }
    handleSubmit = async event => {
        try {
            event.preventDefault();
            this.setState({ ...this.state, submitted: true });
            const { username, password } = this.state;

            if (this.state.formsInvalid || !username || !password) {
                this.setState({ ...this.state, showError: true })
            } else {
                if (this.state.remember_me === true) {
                    const cookies = new Cookies();
                    cookies.set('username', username, { path: '/' });
                    cookies.set('password', password, { path: '/' });
                } else {
                    const cookies = new Cookies();
                    cookies.remove('username');
                    cookies.remove('password');
                }
                this.setState({
                    ...this.state,
                    showError: false,
                    loader: true
                })
                let body = await axios.post('/admin/loginAdmin', { email: username, password })
                if (body.data.status === "success") {
                    localStorage.setItem('token', body.data.details.adminToken);
                    // this.props.history.push('/dashboard')
                    // toast.success(body.data.message);
                    window.location.assign("/dashboard");
                }
            }
        } catch (error) {
            console.log({ error });
            this.setState({
                ...this.state,
                loader: false
            })
            toast.error(error.response.data.message);
        }

    }

    render() {

        return <div className="LoginArea">
            <Loading loader={this.state.loader} />
            <div className="loginBox">
                <figure><img src={require("../../assets/images/Logo.png")} /></figure>
                <h1>Let's Get Started PYCA</h1>
                <h2>Sign in to continue to PYCA.</h2>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>User ID</label>
                        <input type="text" placeholder="Enter User ID" name="username" className="form-control" onChange={this.handleChange('username')} value={this.state.username} />
                        <span className="Icon"><i className="fa fa-user"></i></span>
                        {this.state.showError && this.state.errors.username && <span className="text-danger" >{this.state.errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter Password" value={this.state.password} className="form-control" onChange={this.handleChange('password')} />
                        <span className="Icon"><i className="fa fa-unlock-alt"></i></span>
                        {this.state.showError && this.state.errors.password && <span className="text-danger" >{this.state.errors.password}</span>}
                    </div>

                    <div className="RememberBox">
                        <label className="switch"> Remember me
                        <input type="checkbox" defaultChecked={this.state.remember_me} name="remember_me" onChange={this.handleCheck} />
                            <span className="slider"></span>
                        </label>
                        <div className="clear"></div>
                    </div>
                    <button >Log In <i className="fa fa-sign-in"></i></button>
                </form>
            </div>
        </div>
    }
}
export default Login