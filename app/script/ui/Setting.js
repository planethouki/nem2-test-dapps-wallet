import React from 'react';
import ReactDOM from 'react-dom';

export default class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-3">
                <div className="text-right">
                    <button type="button" className="btn btn-primary">Sign Out</button>
                </div>
            </div>
        )
    }
}