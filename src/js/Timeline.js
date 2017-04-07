import React from 'react';
import ReactDOM from 'react-dom';
import vis from 'vis';
import moment from 'moment';

const skillsToIcons = {
    "washing-machine": "glyphicon-cog",
    refrigerator: "glyphicon-ice-lolly",
    "water-purifier": "glyphicon-filter",
    "air-conditioner": "glyphicon-cloud",
    "house-cleaning": "glyphicon-home",
    "wall-painting": "glyphicon-pushpin",
    gardening: "glyphicon-tree-deciduous",
    computer: "glyphicon-floppy-disk",
    carpentry: "glyphicon-bed",
    plumbing: "glyphicon-wrench"
}

const backgroundApplied = [];

var timeline;
var items = new vis.DataSet();

function applyBackground(resources, startDate, endDate) {
    let dates = [];
    let new_items = [];

    if (endDate) {
        startDate = moment(startDate);
        endDate = moment(endDate);
        while (startDate.isSameOrBefore(endDate, 'day')) {
            if (startDate.day() !== 0 && startDate.day() !== 6) {
                dates.push(startDate.format('YYYY-MM-DD'));
            }
            startDate.add(1, 'days');
        }
    } else {
        dates.push(moment(startDate).format('YYYY-MM-DD'));
    }

    for (var d in dates) {
        if (backgroundApplied.indexOf(moment(dates[d]).format('YYYY-MM-DD')) > -1) {
            continue;
        }

        for (var r in resources) {
            new_items.push({
                type: "background",
                group: resources[r].id,
                content: "",
                start: moment(dates[d]).set({'hour': resources[r].shift.start, 'minute': 0, 'second': 0, 'millisecond': 0}),
                end: moment(dates[d]).set({'hour': resources[r].shift.end, 'minute': 0, 'second': 0, 'millisecond': 0})
            });
        }

        backgroundApplied.push(moment(dates[d]).format('YYYY-MM-DD'));
    }

    items.add(new_items);
    timeline.setItems(items);
}

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        // Create a DataSet (allows two way data-binding)
        // var items = new vis.DataSet([]);
        var groups = new vis.DataSet([]);

        // Configuration for the Timeline
        var options = {
            showCurrentTime: true,
            end: moment().set({'hour': 18, 'minute': 0, 'second': 0, 'millisecond': 0}),
            start: moment().set({'hour': 6, 'minute': 0, 'second': 0, 'millisecond': 0}),
            format: {
                minorLabels: {
                    hour: "h:mma"
                }
            }
        };

        // Create a Timeline
        timeline = new vis.Timeline(this.refs.timeline, items, groups, options);

        
        
        groups = [];

        // cities
        for (var c in this.props.cityResources) {
            groups.push({
                id: `city-${this.props.cityResources[c].id}`,
                content: this.props.cityResources[c].name,
                nestedGroups: this.props.cityResources[c].resources
            });
        }

        // resources
        for (var r in this.props.resources) {
            const icons = this.props.resources[r].skills.map((skill) =>
                `<i class="glyphicon ${skillsToIcons[skill]}"></i>`
            );
            const el = `
                <div class="resource">
                    <div class="resource__name">${this.props.resources[r].name}</div>
                    <div class="resource__skills">${this.props.resources[r].skills.join(' ')}</div>
                    <div class="resource__icons">${icons.join(' ')}</div>
                </div>
            `;
            groups.push({id: this.props.resources[r].id, content: el, className: "resource-container"});
        }

        groups = new vis.DataSet(groups);
        timeline.setGroups(groups);



        applyBackground(this.props.resources, new Date());



        let jeopardyProjects = [];
        let normalProjects = [];

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
                    className: `task task--${this.props.tasks[task].status}`
                });
            }
        }

        items.add(normalProjects);
        timeline.setItems(items);

        

        timeline.on('select', (properties) => {
            this.props.onSelect(properties.items[0])
        });

        timeline.on('rangechanged', (properties) => {
            applyBackground(this.props.resources, properties.start, properties.end);
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
