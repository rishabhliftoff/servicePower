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
var items = new vis.DataSet([]);
var groups = new vis.DataSet([]);

function applyBackground(resources, startDate, endDate) {

    /*
        apply logic for background ex holidays, lunch breaks, shifts etc..
        backgrounds appear on top of each other based on position in groups array
    */

    let dates = [];
    let new_items = [];

    startDate = moment(startDate);

    if (endDate) {
        
        endDate = moment(endDate);
        while (startDate.isSameOrBefore(endDate, 'day')) {
            if (startDate.day() !== 0 && startDate.day() !== 6) {
                dates.push(startDate.format('YYYY-MM-DD'));
            }
            startDate.add(1, 'days');
        }
    } else {
        if (startDate.day() !== 0 && startDate.day() !== 6) {
            dates.push(moment(startDate).format('YYYY-MM-DD'));
        }
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

        this.toggleResourceDisplay = this.toggleResourceDisplay.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    toggleResourceDisplay(e) {
        groups.update({id: e.target.value, visible: e.target.checked});
    }

    componentDidMount() {

        var options = {
            showCurrentTime: true,
            end: moment().set({'hour': 18, 'minute': 0, 'second': 0, 'millisecond': 0}),
            start: moment().set({'hour': 6, 'minute': 0, 'second': 0, 'millisecond': 0}),
            format: {
                minorLabels: {
                    hour: "h:mma"
                }
            },
            max: moment().add(2, 'M'),
            min: moment().subtract(2, 'M')
        };

        timeline = new vis.Timeline(this.refs.timeline, items, groups, options);

        
        
        var default_groups = [];

        // cities
        for (var c in this.props.cityResources) {
            default_groups.push({
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
            default_groups.push({id: this.props.resources[r].id, content: el, className: "resource-container"});
        }

        groups.add(default_groups);
        timeline.setGroups(groups);

        var controlEl = document.getElementById("controlResourceDisplay");
        var controlElChildren = controlEl.children;

        for (var i = 0 ; i<controlElChildren.length; i++) {
            controlElChildren[i].getElementsByTagName('input')[0].checked = true;
        }



        applyBackground(this.props.resources, new Date());



        let jeopardyTasks = [];
        let normalTasks = [];

        for (var task in this.props.tasks) {
            if (this.props.tasks[task].status === 'init') {

                jeopardyTasks.push(this.props.tasks[task]);

            } else {
                normalTasks.push({
                    id: this.props.tasks[task].id,
                    group: this.props.tasks[task].resource,
                    content: this.props.tasks[task].description,
                    start: new Date(this.props.tasks[task].start),
                    end: new Date(new Date(this.props.tasks[task].start).getTime() + this.props.tasks[task].duration * 60 * 60 * 1000),
                    className: `task task--${this.props.tasks[task].status}`
                });
            }
        }

        items.add(normalTasks);
        timeline.setItems(items);

        

        timeline.on('select', (properties) => {
            this.props.onSelect(properties.items[0])
        });

        timeline.on('rangechanged', (properties) => {
            applyBackground(this.props.resources, properties.start, properties.end);
        });
    }

    render() {

        var controlResourceDisplay = this.props.resources.map((r) => {
            return (
                <li className="controlResourceDisplay__list__item">
                    <input
                        className='controlResourceDisplay__list__item__input'
                        name="resources"
                        value={r.id}
                        type="checkbox"
                        onChange={this.toggleResourceDisplay}
                    />
                    <span className='controlResourceDisplay__list__item__name'>{r.name}</span>
                </li>
            );
        })

        return (
            <div>
                <div ref='timeline'>
                
                </div>
                <div>
                    <h3>Display Control</h3>
                    <ul id="controlResourceDisplay" className="controlResourceDisplay__list list-unstyled">
                        {controlResourceDisplay}
                    </ul>
                </div>
            </div>
        );
    }
}
