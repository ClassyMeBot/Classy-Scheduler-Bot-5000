function findSchedules() {
    const input = document.getElementById('input').value.trim();
    const output = document.getElementById('output');

    if (!input) {
        output.textContent = 'Please paste your class schedule constraints.';
        return;
    }

    const constraints = parseInput(input);
    const schedules = generateSchedules(constraints);

    if (schedules.length === 0) {
        output.textContent = 'No valid schedules found.';
    } else {
        output.textContent = schedules.map((schedule, index) => 
            `Schedule ${index + 1}:\n` + formatSchedule(schedule)).join('\n\n');
    }
}

function parseInput(input) {
    const constraints = {};
    const lines = input.split('\n');
    
    lines.forEach(line => {
        const [className, periods] = line.split(' is only taught during periods ');
        if (className && periods) {
            const periodList = periods.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
            constraints[className.trim()] = periodList;
        }
    });

    return constraints;
}

function generateSchedules(constraints) {
    const classes = Object.keys(constraints);
    const allSchedules = [];

    function generate(currentSchedule = {}, classIndex = 0) {
        if (classIndex >= classes.length) {
            allSchedules.push({ ...currentSchedule });
            return;
        }

        const currentClass = classes[classIndex];
        for (const period of constraints[currentClass]) {
            if (!Object.values(currentSchedule).includes(period)) {
                currentSchedule[currentClass] = period;
                generate(currentSchedule, classIndex + 1);
                delete currentSchedule[currentClass];
            }
        }
    }

    generate();
    return allSchedules;
}

function formatSchedule(schedule) {
    return Object.entries(schedule).map(([className, period]) => 
        `Period ${period}: ${className}`).join('\n');
}