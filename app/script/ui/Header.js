import React from 'react';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="d-flex justify-content-between align-items-center border-bottom">
                <div style={{width: '50px'}}>
                    <img src="nem_logo_WEB.png" className="w-100" alt="symbol"/>
                </div>
                <div>nem2-test-dapps-wallet</div>
                <div className="text-center" style={{width: '50px'}}>
                    <button type="button" className="btn btn-light rounded-pill" onClick={this.props.onClickSetting}>
                        &#x2699;
                    </button>
                </div>
            </div>
        )
    }
}