/*
    VARIABLES
*/
// Connect to WebSockets server (SocialNetworkConsumer)
const myWebSocket = new WebSocket(`${document.body.dataset.scheme === 'http' ? 'ws' : 'wss'}://${ document.body.dataset.host }/ws/example/`);

/*
    FUNCTIONS
*/

/**
 * Send data to WebSockets server
 * @param {string} message
 * @param {WebSocket} webSocket
 * @return {void}
 */
function sendData(message, webSocket) {
    webSocket.send(JSON.stringify(message));
}

/*
    EVENTS
*/

/**
 * Send message to update message
 * @param {Event} event
 * @return {void}
 * 
 **/
function handleClickNavigation(event){
    event.preventDefault();
    sendData({
        action: 'Change page',
        data: {
            page: event.target.dataset.target;
        }
    }, myWebSocket), 
}

/**
 * Send message to Websockets server to change the page
 * @param {WebSocket} webSocket
 * @return {void} 
 **/
function setEventsNavigation(webSocket){
    // Navigation
    document.querySelectorAll('.nav__link--page').forEach(link => {
        link.removeEventListener('click', handleClickNavigation, false);
        link.addEventListener('click', handleClickNavigation, false);
    });
}


// Event when a new message is received by WebSockets 

myWebSocket.addEventListener("message", (event) => {
    // Parse the data received 
    const data = JSON.parse(event.data);
    // Renders the HTML received from the Consumer 
    const selector = document.querySelector(data.selector);
    selector.innerHTML = data.html;

    // Update URL
    history.pushState({}, '', data.url) // New Line

    /**
     * Reassigns the events of the newly rendered HTML
     * 
     **/
    updateEvents();

});

/**
 * Update events in every page
 * 
 **/
function updateEvents() {
    // Nav 
    setEventsNavigation(myWebSocket);
}


/**
 * INITIALIZATION
 * 
 **/
updateEvents();
