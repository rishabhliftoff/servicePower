import React from 'react';
import vis from 'vis';

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        let jeopardyProjects = [];
        let normalProjects = [];
        let groups = [];

        for (var r in this.props.resources) {
            const el = `
                <div class="resource">
                    <div class="resource__name">${this.props.resources[r].name}</div>
                    <div class="resource__skills">${this.props.resources[r].skills.join(' ')}</div>
                </div>
            `;
            groups.push({id: this.props.resources[r].id, content: el});
        }

        // first we will add shifts of each of the resource
        for (var r in this.props.resources) {
            normalProjects.push({
                type: "background",
                group: this.props.resources[r].id,
                content: "",
                start: new Date(new Date().setHours(this.props.resources[r].shift.start, 0, 0, 0)),
                end: new Date(new Date().setHours(this.props.resources[r].shift.end, 0, 0, 0))
            });
        }

        for (var task in this.props.tasks) {
            if (this.props.tasks[task].status === 'init') {

                jeopardyProjects.push(this.props.tasks[task]);

            } else {
                normalProjects.push({
                    id: this.props.tasks[task].id,
                    group: this.props.tasks[task].resource,
                    content: this.props.tasks[task].description,
                    start: new Date(this.props.tasks[task].start),
                    end: new Date(new Date(this.props.tasks[task].start).getTime() + this.props.tasks[task].duration * 60 * 60 * 1000),
                    className: `task--${this.props.tasks[task].status}`
                });
            }
        }

        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet(normalProjects);
        groups = new vis.DataSet(groups);

        // Configuration for the Timeline
        var options = {
            showCurrentTime: true,
            end: new Date(new Date().setHours(24, 0, 0, 0)),
            start: new Date(new Date().setHours(0, 0, 0, 0))
        };

        // Create a Timeline
        var timeline = new vis.Timeline(this.refs.timeline, items, groups, options);

        timeline.on('select', (properties) => {
            this.props.onSelect(properties.items[0])
        });
    }

    render() {
        return (
            <div>
                <div ref='timeline'>
                
                </div>
            </div>
        );
    }
}