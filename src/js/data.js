import moment from 'moment';

const cityResources = [
    {id: 1, name: "New York City", resources: [1,2,4,6]},
    {id: 2, name: "San Francisco", resources: [3,5]}
]

// data generator
let houseNum;
let building = [
    "Shantiniketan",
    "Blue lagoon",
    "The Coast",
    "Greetings",
    "Amer"
];
let street = [
    "Richmond road",
    "1st main",
    "5th cross",
    "Hosur road",
    "MG road"
];
let locality = [
    "Brooklyn",
    "Queens",
    "Manhattan",
    "West Portal",
    "Portola"
];

function addressGen() {
    return `#${Math.floor((Math.random() * 100) + 1)}, ${building[Math.floor(Math.random() * 5)]} building, ${street[Math.floor(Math.random() * 5)]}, ${locality[Math.floor(Math.random() * 5)]}`;
}

const skills = [
    {name: "washing-machine",
        r: 2,
        p: [
            "drain not working",
            "unable to dry",
            "not working at all"
        ]
    },
    {name: "refrigerator",
        r: 1,
        p: [
            "not cooling enough",
            "temperature settings broken",
            "door damaged",
            "gas refilling required"
        ]
    },
    {name: "water-purifier",
        r: 2,
        p: [
            "regular service",
            "change filter",
            "change RO",
            "unable to purify water"
        ]
    },
    {name: "air-conditioner",
        r: 1,
        p: [
            "remote not working",
            "not cooling",
            "gas leaking"
        ]
    },
    {name: "house-cleaning",
        r: 3,
        p: [
            "clean 2BHK",
            "clean 1BHK and garden",
            "clean 3BHK and a pool",
            "clean 2BHK and a pool",
            "clean 1BHK",
            "clean 3BHK and garden",
            "clean garden"
        ]
    },
    {name: "wall-painting",
        r:4,
        p: [
            "paint 4 walls",
            "paint 5 walls",
            "paint 6 walls",
            "paint 7 walls"
        ]
    },
    {name: "gardening",
        r:6,
        p: [
            "trim hedges",
            "water big garden",
            "remove weed"
        ]
    },
    {name: "computer",
        r:5,
        p: [
            "install software",
            "monitor not working",
            "computer crashing repeatedly"
        ]
    },
    {name: "carpentry",
        r:4,
        p: [
            "install new door",
            "change locks",
            "install windows"
        ]
    },
    {name: "plumbing",
        r:4,
        p: [
            "install sink",
            "pipes leaking",
            "repair drainage in bathroom"
        ]
    }
]

const resources = [{
    id: 1,
    name: "phil",
    skills: ["refrigerator", "air-conditioner"],
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
    skills: ["house-cleaning"],
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
}];

function getStTime(r) {
    r.n.add(Math.floor((Math.random() * 90) + 1), 'm');
    var se = moment(r.n.format()).set({'hour': r.s.e, 'minute': 0, 'second': 0, 'millisecond': 0});
    var ss = moment(r.n.format()).set({'hour': r.s.s, 'minute': 0, 'second': 0, 'millisecond': 0});

    if (ss.isBefore(r.n) && se.isAfter(r.n) && r.n.day() !== 0 && r.n.day() !== 6) {
        return moment(r.n);
    } else {
        if (se.isBefore(r.n)) {
            r.n.add(1, 'd');    
        }
        r.n.set({'hour': r.s.s, 'minute': 0, 'second': 0, 'millisecond': 0}).add( Math.floor( (Math.random() * 90) + 1 ), 'm' );
        if (r.n.day() === 0) {
            r.n.add(1, 'd');
        } else if (r.n.day() === 6) {
            r.n.add(2, 'd');
        }

        return moment(r.n);
    }
}

function genTasks() {
    let tasks = [];
    let sn;
    let st;
    let stat;
    let d;
    let n = moment();
    let lid = 0;

    var res = {
        1:{n: moment().subtract(3, 'days').set({'hour': 8, 'minute': 0, 'second': 0, 'millisecond': 0}), s: {s: 8, e: 16}},
        2:{n: moment().subtract(3, 'days').set({'hour': 8, 'minute': 0, 'second': 0, 'millisecond': 0}), s: {s: 8, e: 16}},
        3:{n: moment().subtract(3, 'days').set({'hour': 18, 'minute': 0, 'second': 0, 'millisecond': 0}), s: {s: 18, e: 22}},
        4:{n: moment().subtract(3, 'days').set({'hour': 12, 'minute': 0, 'second': 0, 'millisecond': 0}), s: {s: 12, e: 20}},
        5:{n: moment().subtract(3, 'days').set({'hour': 18, 'minute': 0, 'second': 0, 'millisecond': 0}), s: {s: 18, e: 22}},
        6:{n: moment().subtract(3, 'days').set({'hour': 8, 'minute': 0, 'second': 0, 'millisecond': 0}), s: {s: 8, e: 12}},
    }

    for (let i = 0; i < 100; i++) {
        sn = Math.floor(Math.random() * skills.length);
        d = Math.random() * 4;

        st = getStTime(res[skills[sn].r]);
        res[skills[sn].r].n.add(d, 'h');

        if (st.isAfter(n)) {
            stat = "picked";
        } else if ( res[skills[sn].r].n.isBefore(n) ) {
            stat = "completed";
        } else {
            stat = "ongoing";
        }

        lid += Math.floor((Math.random() * 50) + 1);

        tasks.push({
            id: lid,
            location: addressGen(),
            description: skills[sn].p[Math.floor(Math.random() * skills[sn].p.length)],
            skills: [skills[sn].name],
            resource: skills[sn].r,
            duration: Math.round(d*100)/100,
            start: st,
            status: stat
        });
    }

    return tasks;
}

//status: init, picked, ongoing, completed

module.exports = {
    cityResources: cityResources,
    resources: resources,
    genTasks: genTasks
}
