import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class MonthlyTextReport extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        const { title, data  } = this.props;

        const listItems = data.length > 0 && data.map((d) =>
            <Button variant="success"
                style={{ marginBottom: 15, marginRight: 5, width: 140, height: 100, borderColor: 'black', borderWidth: 2, color: 'white' }}
                key={d.monthNumber} 
            >               
                <div>
                    {
                        d.totalSales > 0 ? (
                            <div>
                                <h5>{d.monthName}</h5>
                                <div>
                                    <h4>${d.totalSales}</h4>
                                </div>
                            </div>
                        ): (
                                <div>
                                    {d.monthName}
                                    <br />
                                    ${d.totalSales}
                                </div>
                            )
                    }                    
                </div>               
            </Button>
        );

        return (
            <div className="container">              
                <div>                
                    <div className="monthlyStoreWiseTextHeader">
                        <h2>Sales Report</h2>
                        {title}
                    </div>
                    <p></p>
                    {listItems}
                </div>
                <hr />
            </div>
        );
    }
}