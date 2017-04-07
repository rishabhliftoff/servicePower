import React from 'react';
import Timeline from './Timeline';
import TaskDetails from './TaskDetails';
import { cityResources, resources, genTasks } from './data';

console.log(genTasks);

let tasks = genTasks();

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
                <Timeline cityResources={cityResources} resources={resources} tasks={tasks} onSelect={this.onSelect} />
                {taskDetails}
            </div>
        );
    }
}
