import React from 'react';
import Timeline from './Timeline';
import TaskDetails from './TaskDetails';

const resources = [{
    id: 1,
    name: "phil",
    skills: ["refridgerator", "air-conditioner"],
    shift: {
        start: 8,
        end: 16
    }
}, {
    id: 2,
    name: "clark",
    skills: ["washing-machine", "water-purifier"],
    shift: {
        start: 8,
        end: 16
    }
}, {
    id: 3,
    name: "amy",
    skills: ["babysitting", "house-cleaning"],
    shift: {
        start: 18,
        end: 22
    }
}, {
    id: 4,
    name: "ben",
    skills: ["carpentry", "wall-painting", "plumbing"],
    shift: {
        start: 12,
        end: 20
    }
}, {
    id: 5,
    name: "greg",
    skills: ["computer"],
    shift: {
        start: 18,
        end: 22
    }
}, {
    id: 6,
    name: "rachel",
    skills: ["gardening"],
    shift: {
        start: 8,
        end: 12
    }
}]

//status: init, picked, ongoing, completed
let tasks = [{
    id: 703,
    location: "#123, abc villa",
    description: "repair washing machine, drain function not working",
    skills: ["washing-machine"],
    duration: 2,
    status: "completed",
    start: new Date().setHours(9, 0, 0, 0),
    resource: 2
}, {
    id: 734,
    location: "#234/E, def villa",
    description: "repair refridgerator, not starting",
    skills: ["refridgerator"],
    duration: 4,
    status: "ongoing",
    start: new Date(new Date().setMinutes(0, 0, 0) - .5*60*60*1000),
    resource: 1
}, {
    id: 735,
    location: "#257, B villa",
    description: "clean 4BHK house",
    skills: ["house-cleaning"],
    duration: 2.2,
    status: "picked",
    start: new Date().setHours(18, 0, 0, 0),
    resource: 3
}, {
    id: 705,
    location: "#624, A villa",
    description: "babysitting 2 children for 2 hours",
    skills: ["babysitting"],
    duration: 2,
    status: "picked",
    start: new Date(new Date().setHours(20, 0, 0, 0) + 24*60*60*1000),
    resource: 3
}, {
    id: 760,
    location: "#43/T, C villa",
    description: "repair refridgerator, unable to cool fully",
    skills: ["refridgerator"],
    duration: 1.5,
    status: "completed",
    start: new Date().setHours(8, 0, 0, 0),
    resource: 1
}, {
    id: 710,
    location: "#923, A villa",
    description: "clean 1BHK house and pool",
    skills: ["house-cleaning"],
    duration: 1.5,
    status: "picked",
    start: new Date().setHours(20, 30, 0, 0),
    resource: 3
}, {
    id: 712,
    location: "#078, B villa",
    description: "water and trim the garden",
    skills: ["gardening"],
    duration: 0.8,
    status: "completed",
    start: new Date().setHours(8, 0, 0, 0),
    resource: 6
}, {
    id: 764,
    location: "#417/A, C villa",
    description: "change lock on door",
    skills: ["carpentry"],
    duration: 1.4,
    status: "ongoing",
    start: new Date().setMinutes(0, 0, 0),
    resource: 4
}, {
    id: 775,
    location: "#294/S, C villa",
    description: "water purifier regular servicing",
    skills: ["water-purifier"],
    duration: 0.7,
    status: "completed",
    start: new Date().setHours(8, 0, 0, 0),
    resource: 2
}, {
    id: 843,
    location: "#285, def villa",
    description: "washing machine repair, not operating at all",
    skills: ["washing-machine"],
    duration: 4.5,
    status: "picked",
    start: new Date(new Date().setHours(10, 0, 0, 0) + 24*60*60*1000),
    resource: 2
}, {
    id: 794,
    location: "#724/E, C villa",
    description: "refridgerator repair, main door damaged",
    skills: ["refridgerator"],
    duration: 1,
    status: "completed",
    start: new Date().setHours(10, 0, 0, 0),
    resource: 1
}, {
    id: 729,
    location: "#935, B villa",
    description: "clean big villa and garden",
    skills: ["house-cleaning"],
    duration: 5,
    status: "init"
}];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTask: undefined
        };

        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(id) {
        this.setState({
            selectedTask: id
        });
    }

    render() {
        let taskDetails;

        if (this.state.selectedTask) {
            const task = tasks.find((t) => t.id === this.state.selectedTask);
            taskDetails = (
                <TaskDetails task={task} closeModal={this.onSelect} />
            );
        }

        return (
            <div>
                <img src="/images/service-power-logo.png" />
                <Timeline resources={resources} tasks={tasks} onSelect={this.onSelect} />
                {taskDetails}
            </div>
        );
    }
}
