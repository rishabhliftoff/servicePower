import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class TaskDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: true};

        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close() {
        this.setState({
            showModal: false
        });

        this.props.closeModal();
    }

    open() {
        this.setState({
            showModal: true
        });
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr><td>ID</td><td>{this.props.task.id}</td></tr>
                            <tr><td>Location</td><td>{this.props.task.location}</td></tr>
                            <tr><td>Description</td><td>{this.props.task.description}</td></tr>
                            <tr><td>Duration</td><td>{this.props.task.duration} hours</td></tr>
                            <tr><td>Status</td><td>{this.props.task.status}</td></tr>
                            <tr><td>Skills required</td><td>{this.props.task.skills}</td></tr>
                            <tr><td>Start</td><td>{new Date(this.props.task.start).toString()}</td></tr> 
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}