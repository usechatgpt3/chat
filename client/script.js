import bot from './assets/bot.svg'
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += 'Thinking';

        if (element.textContent === 'ThinkingThinking') {
            element.textContent = '';
        }
    }, 800)
}

function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;

            // scroll the message element into view
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            clearInterval(interval);
        }
    }, 20)
}



function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function createChatStripe(isAi, value, uniqueId) {
    const wrapper = document.createElement('div');
    wrapper.className = `wrapper ${isAi ? 'ai' : ''}`;

    const chat = document.createElement('div');
    chat.className = 'chat';
    wrapper.appendChild(chat);

    const profile = document.createElement('div');
    profile.className = 'profile';
    chat.appendChild(profile);

    const img = document.createElement('img');
    img.src = isAi ? bot : user;
    img.alt = isAi ? 'bot' : 'user';
    profile.appendChild(img);

    const message = document.createElement('div');
    message.className = 'message';
    message.id = uniqueId;
    message.innerText = value;
    chat.appendChild(message);

    return wrapper;
}



const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chatstripe
    chatContainer.appendChild(createChatStripe(false, data.get('prompt')));

    form.reset();

  


    //bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.appendChild(createChatStripe(true, " ", uniqueId));

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    //fetch data from server -> bot's response
    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";

        alert(err);
    }
};

       

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {

    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})