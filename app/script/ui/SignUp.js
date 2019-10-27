import React from 'react';
import ReactDOM from "react-dom";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this)
    }

    signUp() {
        const background = chrome.extension.getBackgroundPage();
        const pwElm = ReactDOM.findDOMNode(this.refs.password);
        const privElm = ReactDOM.findDOMNode(this.refs.privateKey);
        console.log(pwElm.value, privElm.value);
        background.popup.setInitialAccount(privElm.value, pwElm.value)
    }

    render() {
        return (
            <div className="p-3">
                <div className="form-group">
                    <label htmlFor="input-private-key">Private Key</label>
                    <input type="text" className="form-control" id="input-private-key" placeholder="Private Key" ref="privateKey" />
                </div>
                <div className="form-group">
                    <label htmlFor="input-password">Password</label>
                    <input type="password" className="form-control" id="input-password" placeholder="Password" ref="password" />
                </div>
                <div className="text-right">
                    <button type="button" className="btn btn-primary" onClick={this.signUp}>Sign Up</button>
                </div>
            </div>
        );
    }
}