const answerKey = {
    'topic1': {
        'q1': 1,
        'q2': 1,
        'q3': 2,
        'q4': 3
    },
    'topic2': {
        'q1': 3,
        'q2': 2,
        'q3': 3
    },
    'topic3': {
        'q1': 1,
        'q2': 2,
        'q3': 2
    },
    'topic4': {
        'q1': 1,
        'q2': 1,
        'q3': 3
    },
    'topic5': {
        'q1': 2,
        'q2': 1,
        'q3': 3
    },
    'topic6': {
        'q1': 1,
        'q2': 2,
        'q3': 2
    },
    'topic7': {
        'q1': 3,
        'q2': 1
    }
};

const inputs = Array.from(document.querySelectorAll('.checkpoints input'));

inputs.forEach(input => {
    input.addEventListener('click', () => {
        const label = document.querySelector(`label[for='${input.id}']`);

        const topic = Object.keys(answerKey).find(t => input.id.includes(t));
        console.log(topic);

        const question = Object.keys(answerKey[topic]).find(q => input.id.includes(q));
        console.log(question);

        const answerNum = input.id.split('-')[2];

        if (answerNum.includes(answerKey[topic][question])) {
            label.style.color = 'green';
        } else {
            label.style.color = 'red';
        }
    });
});