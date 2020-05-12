const message = 'Some message from myModule.js';
const name = 'Roger Takeshita';
const location = 'Toronto';
const getGreeting = (name) => `Welcome to the course ${name}`;

export { message, name, getGreeting, location as default };
