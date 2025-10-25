const answerKey = {
    'topic1': {
        'q1': 1,
        'q2': 1,
        'q3': 1,
        'q4': 1
    },
    'topic2': {
        'q1': 1,
        'q2': 1,
        'q3': 1
    },
    'topic3': {
        'q1': 1,
        'q2': 1,
        'q3': 1
    },
    'topic4': {
        'q1': 1,
        'q2': 1,
        'q3': 1
    },
    'topic5': {
        'q1': 1,
        'q2': 1,
        'q3': 1
    },
    'topic6': {
        'q1': 1,
        'q2': 1,
        'q3': 1
    },
    'topic7': {
        'q1': 1,
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