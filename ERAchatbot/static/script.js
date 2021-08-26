$(document).ready(() => {


	/******************/
	/*** START CHAT ***/
	/******************/


	// set visitor name
	let $userName = "Tom";

	// start chatbox
	$("#form-start").on("submit", (event) => {
		event.preventDefault();
		$userName = $("#username").val();
		$("#landing").slideUp(300);
		setTimeout(() => {
			$("#start-chat").html("Continue chat")
		}, 300);
	});




	/*****************/
	/*** USER CHAT ***/
	/*****************/


	// Post a message to the board
	
	// function $postMessage() {
	// 	$("#message").find("br").remove();
	// 	let $message = $("#message").html().trim(); // get text from text box
	// 	$message = $message.replace(/<div>/, "<br>").replace(/<div>/g, "").replace(/<\/div>/g, "<br>").replace(/<br>/g, " ").trim();
	// 	if ($message) { // if text is not empty
	// 		const html = `<div class="post post-user">${$message + timeStamp()}</span></div>`; // convert post to html
	// 		$("#message-board").append(html); // add post to board
	// 		$scrollDown(); // stay at bottom of chat
	// 		botReply($message);
	// 	};
	// 	$("#message").empty();
	// };

	// // Chat input
	// $("#message").on("keyup", (event) => {
	// 	if (event.which === 13) $postMessage(); // Use enter to send
	// }).on("focus", () => {
	// 	$("#message").addClass("focus");
	// }).on("blur", () => {
	// 	$("#message").removeClass("focus");
	// });
	// $("#send").on("click", $postMessage);

	// sk chatbot
	
	function getResponse() {
		let user_response = $("#message").val();
		let userHtml = '<p class="userText"><span>' + user_response + '</span></p>';
		$("#message").val("");
		$("#chatbox").append(userHtml);
		document.getElementById('message').scrollIntoView({block: 'start', behavior: 'smooth'});
		$.get("/get", { msg: user_response }).done(function(data) {
		var botHtml = '<p class="botText"><span>' + data + '</span></p>';
		$("#chatbox").append(botHtml);
		document.getElementById('message').scrollIntoView({block: 'start', behavior: 'smooth'});
	});
	}
	$("#textInput").keypress(function(e) {
	//if enter key is pressed
		if(e.which == 13) {
			getResponse();
		}
	});
	$("#buttonInput").click(function() {
		getResponse();
	});
	
	src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"
	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
	src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"


	/**********************/
	/*** AUTO REPLY BOT ***/
	/**********************/


	// function botReply(userMessage) {
	// 	const reply = generateReply(userMessage);
	// 	if (typeof reply === "string") postBotReply(reply);
	// 	else reply.forEach((str) => postBotReply(str));
	// };

	// function generateReply(userMessage) {
	// 	const message = userMessage.toLowerCase();
	// 	let reply = [`Sorry, I don't understand you.`, `Please try again`];

	// 	// Generate some different replies
	// 	if (/^hi$|^hell?o|^howdy|^hoi|^hey|^ola/.test(message)) reply = [`Hi ${$userName}`,`Commands for Lectures Link :  - Subject `,`-DMS`,`-JAVA`];
	// 	else if (/test/.test(message)) reply = [`Ok`, `Feel free to test as much as you want`];
	// 	else if (/help|sos|emergency|support/.test(message)) reply = [`I am here to help.`, `What seems to be the problem?`];
	// 	else if (/class\=\"fa/.test(message)) reply = [`I see you've found the smileys`, `Cool! <span class="far fa-grin-beam fa-2x"></span>`, `Did you need something?`];
	// 	else if (/-DMS|-dms/.test(message)) reply = "chal hat bsdk";
	// 	else if (/-DSA|-dsa/.test(message)) reply = "khud hi karna padega";
	// 	else if (/math link|what|why/.test(message)) reply = "chal hat bsdk";
	// 	else if (/^huh+|boring|lame|wtf|pff/.test(message)) reply = [`<span class="far fa-dizzy fa-2x"></span>`, `I'm sorry you feel that way`, `How can I make it better?`];
	// 	else if (/bye|ciao|adieu|salu/.test(message)) reply = [`Ok, bye :)`];

	// 	return reply;
	// };

	function postBotReply(reply) {
		const html = `<div class="post post-bot">${reply + timeStamp()}</div>`;
		const timeTyping = 500 + Math.floor(Math.random() * 2000);
		$("#message-board").append(html);
		$scrollDown();
	};



	/******************/
	/*** TIMESTAMPS ***/
	/******************/


	function timeStamp() {
		const timestamp = new Date();
		const hours = timestamp.getHours();
		let minutes = timestamp.getMinutes();
		if (minutes < 10) minutes = "0" + minutes;
		const html = `<span class="timestamp">${hours}:${minutes}</span>`;
		return html;
	};




	/***************/
	/*** CHAT UI ***/
	/***************/


	// Back arrow button
	$("#back-button").on("click", () => {
		$("#landing").show();
	});


	// Menu - navigation
	$("#nav-icon").on("click", () => {
		$("#nav-container").show();
	});

	$("#nav-container").on("mouseleave", () => {
		$("#nav-container").hide();
	});

	$(".nav-link").on("click", () => {
		$("#nav-container").slideToggle(200);
	});

	// Clear history
	$("#clear-history").on("click", () => {
		$("#message-board").empty();
		$("#message").empty();
	});

	// Sign out
	$("#sign-out").on("click", () => {
		$("#message-board").empty();
		$("#message").empty();
		$("#landing").show();
		$("#username").val("");
		$("#start-chat").html("Start chat");
	});




	/*********************/
	/*** SCROLL TO END ***/
	/*********************/


	function $scrollDown() {
		const $container = $("#message-board");
		const $maxHeight = $container.height();
		const $scrollHeight = $container[0].scrollHeight;
		if ($scrollHeight > $maxHeight) $container.scrollTop($scrollHeight);
	}




	/***************/
	/*** EMOIJIS ***/
	/***************/


	// toggle emoijis
	$("#emoi").on("click", () => {
		$("#emoijis").slideToggle(300);
		$("#emoi").toggleClass("fa fa-grin far fa-chevron-down");
	});

	// add emoiji to message
	$(".smiley").on("click", (event) => {
		const $smiley = $(event.currentTarget).clone().contents().addClass("fa-lg");
		$("#message").append($smiley);
		$("#message").select(); // ==> BUG: message field not selected after adding smiley !! 
	});





});