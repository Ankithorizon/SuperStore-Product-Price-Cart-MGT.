import React, { Component } from "react";

export default class UnAuthPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        return (
            <div>
                <h3>
                    Un-Authorized !
                </h3>
                <h5>
                    Please Login with higher Credential !
                </h5>
            </div>
        );
    }
}