import React, { Component } from "react";
import { Col } from "reactstrap";
import { Card } from "react-bootstrap";
import "../../css/students/ViewMeeting.scss";
import { Table } from "react-bootstrap";

class viewMeetBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meetData: this.props.data,
    };
  }

  render() {
    const { meetData } = this.state;

    return (
      <div style={{ marginTop: "20px" }}>
        <Table hover className="as-table">
          <thead>
            <tr>
              <th className="table-head">Supervisor</th>

              <th className="table-head">Date</th>

              <th className="table-head">Time</th>

              <th className="table-head">Purpose</th>

              <th className="table-head">State</th>
            </tr>
          </thead>

          <tbody>
            {meetData.length > 0 &&
              meetData.map((item, i) => {
                return (
                  <tr
                    className="as-table-row"
                    key={item.id}
                    onClick={() => this.groupDataHandler(item.id)}
                  >
                    <td className="table-body">{item.supervisor}</td>

                    <td className="table-body">{item.date.substring(0, 10)}</td>

                    <td className="table-body">{item.time}</td>

                    <td className="table-body">{item.purpose}</td>

                    {item.state === "pending" && (
                      <td className="table-body" style={{ color: "orange" }}>
                        {item.state}
                      </td>
                    )}

                    {item.state === "confirmed" && (
                      <td className="table-body" style={{ color: "green" }}>
                        {item.state}
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default viewMeetBlock;
