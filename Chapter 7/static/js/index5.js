/*
   VARIABLES  
 */

// Connect to Websockets Server (SocialNetworkConsumer)
const myWebSocket = new WebSocket(`${document.body.dataset.scheme === "http" ? "ws": "wss" }://${ document.body.dataset.host}/ws/blog/`);

/*
	FUNCTIONS
*/

/**
 * Send data to Websockets over 
 * @param {string} message
 * @param {WebSocket} Websocket
 * @return {void}
 * 
 **/

function sendData(message, webSocket) {
	webSocket.send(JSON.stringify(message))
}

/**
 * Send page to update the page
 * @param {Event} event
 * @returns {void}
 * 
 **/

function changePage(event) {
	event.preventDefault();
	sendData({
		action: "Change page",
		data: {
			page: event.target.dataset.target,
			id: event.target.dataset?.id
		}
	});
}

/*
	 EVENTS
*/

/**
 * Send message to WebSockets server to change the page
 * @param {WebSocket} webSocket
 * @return {void}
 * 
 **/

function setEventsNavigation(webSocket) {
	// Navigation
	document.querySelectorAll(".nav__link--page").forEach(link => {
		link.removeEventListener("click", changePage, false);
		link.addEventListener("click", changePage, false);
	});
}


// Event when a new message is received by WebSockets 
myWebSocket.addEventListener("message", (event) => {
	// Parse the data received 
	const data = JSON.parse(event.data);
	// Renders the HTML received from the Consumer
	const selector = document.querySelector(data.selector);
	// We only allow all users to render if we receive a broadcast as true and it is at the same url.
	if (
			data.broadcast === undefined ||
			!data.broadcast ||
			(data.broadcast && data.url === document.location.pathname)

		)  {

		// If append is received, it will be appended. Otherwise the entire DOM will be replaced.
		if (data.append) {
			selector.innerHTML += data.html;
		} else {
			selector.innerHTML = data.html;
		}
		// Update URL 
		history.pushState({}, "", data.url);
	}

	/**
	 *  Reassigns the events of the newly renderd HTML
	 * 
	 **/
	updateEvents();
});

/**
 * Event to add a next page with pagination
 * @param event
 * 
 **/
function addNextPaginator(event) {
	const nextPage = event.target.dataset.nextPage;
	sendDate({
		action: "Add next posts",
		data: {
			page: nextPage
		},
	}, myWebSocket);
}

/**
 * Event to request a search
 * @param event
 * 
 **/
function search(event) {
	event.preventDefault();
	alert("Hello, I'm an alert box!");
}

/**
 * Update events in every page
 * return {void}
 * 
 **/
function updateEvents() {
		// Nav
		setEventsNavigation(myWebSocket);
		// Search form
		const searchForm = document.querySelector("#search-form");
		searchForm.removeEventListener("submit", search, false);
		searchForm.addEventListener("submit", search, false);


		// Comment form 
		const commentForm = document.querySelector("#comment-form");
		if (commentForm !== null) {
			commentForm.removeEventListener("submit", addComment, false);
			commentForm.addEventListener("submit", addComment, false);

		}

		// Link to single post
		const linksPostItem = document.querySelector(".post-item__link");
		if (linksPostItem !== null) {
			linksPostItem.forEach(link => {
				link.removeEventListener("click", changePage, false);
				link.addListener("click", changePage, false);
			});
			

		}

		// Paginator
		const paginator = document.querySelector("#paginator");
		if (paginator !== null) {
			paginator.removeEventListener("click", addNextPaginator, false);
			paginator.removeEventListener("click", addNextPaginator, false);

		}
	}
