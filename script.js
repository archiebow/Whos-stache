
// Utility functions

function randomRange(excludedMax) {
	return Math.floor(Math.random() * excludedMax);
}

function getRandomElement(array) {
	return array[randomRange(array.length)];
}

function getRandomCharacter() {
	return getRandomElement(data.characters);
}

function generateAnswerButtons(answers) {
	var buttonElements = [];
	for (idx in answers) {
		var element = $(`<div class="answer alternative">${answers[idx]}</div>`);
		if (idx == 0) {
			rightAnswer = element;
		}
		(function(index) {
			// Bind onClick event to our answerClick function
			element.click(function(event) {
				answerClick(event, index);
			});
			buttonElements.push(element);
		})(idx);
	}
	addButtonsToPage(buttonElements);
}

function addButtonsToPage(buttonElements) {
	var animationDelay = 1;
	// Add buttons to page with delayed animations between themselves
	while (buttonElements.length > 0) {
		var index = randomRange(buttonElements.length);
		var element = buttonElements.splice(index, 1)[0]
		element.css("animation-delay", animationDelay + "s");
		animationDelay += 0.25;
		element.appendTo("#answers");
	}
}


// Initialization

$(document).ready(function(e) {
	$("#next > div").click(nextClick);
	gameStep = game();
	gameStep.next();
});


// Game functions

function* game() {
	var characters = selectCharacters(10);
	for (idx in characters) {
		var character = characters[idx];
		stacheQuestion(character);
		yield;
		characterQuestion(character);
		yield;
	}
}

function selectCharacters(count=10) {
	var characters = [];
	while (characters.length < count) {
		var character = getRandomCharacter();
		if (data.characters.length > count) {
			// Check if character already in selection
			if (characters.indexOf(character) == -1) {
				characters.push(character);
			}
		} else {
			// Too few characters available to get unique set
			characters.push(character);
		}
	}
	return characters;
}

function stacheQuestion(answerCharacter) {
	hasAnswered = false;
	// Add the right character to the list of options
	var names = [answerCharacter.name];
	while (names.length < 3) {
		var name = getRandomCharacter().name;
		// Check if name already in selection
		if (names.indexOf(name) == -1) {
			names.push(name);
		}
	}
	var charimg = answerCharacter.croppedfilename;
	uncroppedimg = answerCharacter.filename;
	$("#image").css("background-image", "url("+charimg+")");
	
	bioText = answerCharacter.bio
	answerText = "Fun Fact: " + getRandomElement(answerCharacter.funfacts)
	generateAnswerButtons(names);
}

function characterQuestion(answerCharacter) {
	hasAnswered = false;
	var charimg = answerCharacter.filename;
	$("#image").css("background-image", "url("+charimg+")");
	var question = getRandomElement(answerCharacter.questions);
	$("#question").text(question.question);
	var answers = question.answers;
	answerText = question.answertext;
	bioText = ""
	generateAnswerButtons(answers);
}

function answerClick(event, answer) {
	if (!hasAnswered) {
		hasAnswered = true;
		if (answer == 0) {
			$(event.target).addClass("right");
		} else {
			$(event.target).addClass("wrong");
			rightAnswer.addClass("right");
		}
		$("#biotext").text(bioText);
		$("#biotext").css("animation", "fade-in 1s");
		$("#answertext").text(answerText);
		$("#answertext").css("animation", "fade-in 1s");
		$("#next").removeClass("hidden");
		$("#next > div").css("animation-name", "slide-in");
		$("#next > div").css("animation-timing-function", "ease-out");
		$("#image").css("background-image", "url("+uncroppedimg+")");
	}
}

function nextClick() {
	var answerElements = $(".answer");
	var animationDelay = 0;
	for (i = 0; i < answerElements.length; i++) {
		$(answerElements[i]).removeClass("alternative");
		$(answerElements[i]).addClass("slide-out");
		$(answerElements[i]).css("animation-delay", animationDelay + "s");
		animationDelay += 0.25;
	}
	$("#next > div").css("animation-name", "slide-out");
	$("#next > div").css("animation-fill-mode", "forwards");
	$("#next > div").css("animation-timing-function", "ease-in");
	$("#answertext").css("animation", "fade-out 1s");
	$("#answertext").css("animation-fill-mode", "forwards");
	$("#biotext").css("animation", "fade-out 1s");
	$("#biotext").css("animation-fill-mode", "forwards");
	$("#question").css("animation", "fade-out 1s");
	$("#question").css("animation-fill-mode", "forwards");
	setTimeout(() => {
		$("#answers").empty();
		$("#answertext").text("");
		$("#biotext").text("");
		$("#question").css("animation", "");
		$("#question").text("");
		gameStep.next();
	}, 1500);
}
