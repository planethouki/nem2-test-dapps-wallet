import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ui/ErrorBoundary';
import Header from './ui/Header';
import Account from './ui/Account'
import SignIn from './ui/SignIn';
import SignUp from './ui/SignUp';

class App extends React.Component {
    constructor(props) {
        super(props);
        const background = chrome.extension.getBackgroundPage();
        this.state = {
            existsAccount: background.popup.existsAccount(),
            existsPassword: background.popup.existsPassword()
        };
        background.popup.setCallback((state) => {
            this.setState(state)
        })
    }

    login() {
        if (this.state.existsAccount) {
            if (this.state.existsPassword) {
                return <Account />
            }
            return <SignIn />
        }
        return <SignUp />
    }

    render() {
        return (
            <ErrorBoundary>
                <Header />
                {this.login()}
            </ErrorBoundary>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('react'));