import React from 'react';
import ReactDOM from 'react-dom';

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this)
    }

    signIn() {
        const background = chrome.extension.getBackgroundPage();
        const pwElm = ReactDOM.findDOMNode(this.refs.password);
        console.log(pwElm.value);
        background.popup.setPassword(pwElm.value)
    }

    render() {
        return (
            <div className="p-3">
                <div className="form-group">
                    <label htmlFor="input-password">Password</label>
                    <input type="password" className="form-control" id="input-password" placeholder="Password" ref="password" />
                </div>
                <div className="text-right">
                    <button type="button" className="btn btn-primary" onClick={this.signIn}>Sign In</button>
                </div>
            </div>
        )
    }
}