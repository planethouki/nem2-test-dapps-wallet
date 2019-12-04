import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ui/ErrorBoundary';
import Header from './ui/Header';
import Account from './ui/Account'
import SignIn from './ui/SignIn';
import SignUp from './ui/SignUp';
import Setting from './ui/Setting'

class App extends React.Component {
    constructor(props) {
        super(props);
        const background = chrome.extension.getBackgroundPage();
        this.state = {
            existsAccount: background.popup.existsAccount(),
            existsPassword: background.popup.existsPassword(),
            isInSetting: false
        };
        background.popup.setCallback((state) => {
            this.setState(state)
        })
        this.onClickSetting = this.onClickSetting.bind(this)
    }

    onClickSetting() {
        this.setState((state) => {
            return {
                isInSetting: !state.isInSetting
            }
        })
    }

    body() {
        if (this.state.existsAccount) {
            if (this.state.existsPassword) {
                if (this.state.isInSetting) {
                    return <Setting />
                }
                return <Account />
            }
            return <SignIn />
        }
        return <SignUp />
    }

    render() {
        return (
            <ErrorBoundary>
                <Header onClickSetting={this.onClickSetting} />
                {this.body()}
            </ErrorBoundary>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('react'));