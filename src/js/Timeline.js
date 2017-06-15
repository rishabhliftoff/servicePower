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
    endDate = moment(endDate);

    while (startDate.isSameOrBefore(endDate, 'day')) {
        if (startDate.day() !== 0 && startDate.day() !== 6) {
            dates.push(startDate.format('YYYY-MM-DD'));
        }
        startDate.add(1, 'days');
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

function applyGroups(resources, cityResources) {
    var newSuperGroups = [];

    for (var c in cityResources) {
        newSuperGroups.push({
            id: `city-${cityResources[c].id}`,
            content: cityResources[c].name,
            nestedGroups: cityResources[c].resources
        });
    }

    groups.add(newSuperGroups);

    var newGroups = [];
    for (var r in resources) {
        const icons = resources[r].skills.map((skill) =>
            `<i class="glyphicon ${skillsToIcons[skill]}"></i>`
        );
        const el = `
            <div class="resource">
                <div class="resource__name">${resources[r].name}</div>
                <div class="resource__skills">${resources[r].skills.join(' ')}</div>
                <div class="resource__icons">${icons.join(' ')}</div>
            </div>
        `;
        newGroups.push({id: resources[r].id, content: el, className: "resource-container"});
    }

    groups.add(newGroups);
    timeline.setGroups(groups);
}


function applyTasks(tasks) {
    let jeopardyTasks = [];
    let normalTasks = [];

    for (var task in tasks) {
        if (tasks[task].status === 'init') {

            jeopardyTasks.push(tasks[task]);

        } else {

            const el = `
                <div class="task-inner">
                    <div class="task-travel task-travel--out" style='width:${tasks[task].travelTime.out*100/tasks[task].duration}%'></div>
                    <div class="task-desc">${tasks[task].description}</div>
                    <div class="task-travel task-travel--in" style='width:${tasks[task].travelTime.in*100/tasks[task].duration}%'></div>
                </div>
            `;

            normalTasks.push({
                id: tasks[task].id,
                group: tasks[task].resource,
                // content: this.props.tasks[task].description,
                content: el,
                start: new Date(tasks[task].start),
                end: new Date(new Date(tasks[task].start).getTime() + tasks[task].duration * 60 * 60 * 1000),
                className: `task task--${tasks[task].status}`
            });
        }
    }

    items.add(normalTasks);
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
          editable: {
            add: false,         // add new items by double tapping
            updateTime: true,  // drag items horizontally
            updateGroup: true, // drag items from one group to another
            remove: true,       // delete an item by tapping the delete button top right
            overrideItems: false  // allow these options to override item.editable
          },
            clickToUse: true,
            itemsAlwaysDraggable: true,
            showCurrentTime: true,
            end: moment().set({'hour': 18, 'minute': 0, 'second': 0, 'millisecond': 0}),
            start: moment().set({'hour': 6, 'minute': 0, 'second': 0, 'millisecond': 0}),
            format: {
                minorLabels: {
                    hour: "h:mma"
                }
            },
            max: moment().add(2, 'M'),
            min: moment().subtract(2, 'M'),
            zoomMax: (30 * 24 * 60 * 60 * 1000),
            zoomMin: (12 * 60 * 60 * 1000)
        };

        timeline = new vis.Timeline(this.refs.timeline, items, groups, options);



        // resources
        applyGroups(this.props.resources, this.props.cityResources);


        var controlEl = document.getElementById("controlResourceDisplay");
        var controlElChildren = controlEl.children;

        for (var i = 0 ; i<controlElChildren.length; i++) {
            controlElChildren[i].getElementsByTagName('input')[0].checked = true;
        }


        applyBackground(this.props.resources, new Date(), new Date());


        applyTasks(this.props.tasks);


        timeline.on('click', (properties) => {
            if(properties.item && properties.what === 'item') {
                this.props.onSelect(properties.item);
            }
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
