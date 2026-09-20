const student = {
    name: 'Pallavi',
    topic: 'Node.js fundamentals'
};

function describeStudent(person) {
    return `${person.name} is learning ${person.topic}.`;
}

console.log(describeStudent(student));
console.log('Node version:', process.version);
console.log('Arguments:', process.argv.slice(2));