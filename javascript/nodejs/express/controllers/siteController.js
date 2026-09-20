const messages = [];

function createMessage(name, message) {
    const newMessage = {
        id: messages.length + 1,
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    return newMessage;
}

function getStatus() {
    return {
        application: 'Express Framework Practical',
        messagesReceived: messages.length,
        running: true
    };
}

module.exports = { createMessage, getStatus };