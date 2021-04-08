function randomRange(excludedMax) {
	return Math.floor(Math.random() * excludedMax);
}

function getRandomCharacter() {
	var id = randomRange(data.characters.length);
	var character = data.characters[id];
	character.id = id;
	return character;
}

$(document).ready(function(e) {
	$("#next > div").click(nextClick);
	gameStep = game();
	gameStep.next();
});

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
			if (characters.indexOf(character) == -1) {
				characters.push(character);
			}
		} else {
			characters.push(character);
		}
	}
	return characters;
}

function stacheQuestion(answerCharacter) {
	hasAnswered = false;
	var characters = [answerCharacter];
	while (characters.length < 3) {
		var character = getRandomCharacter();
		if (characters.indexOf(character) == -1) {
			characters.push(character);
		}
	}
	var charimg = answerCharacter.croppedfilename;
	uncroppedimg = answerCharacter.filename;
	$("#image").css("background-image", "url("+charimg+")");

	answerText = answerCharacter.funfacts[randomRange(answerCharacter.funfacts.length)];
	var answerList = [];
	for (idx in characters) {
		var element = $(`<div class="answer alternative">${characters[idx].name}</div>`);
		if (idx == 0) {
			rightAnswer = element;
		}
		(function(index) {
			element.click(function(event) {
				answerClick(event, index);
			});
			answerList.push(element);
		})(idx);
	}
	var animationDelay = 1;
	while (answerList.length > 0) {
		var index = randomRange(answerList.length);
		var element = answerList.splice(index, 1)[0]
		element.css("animation-delay", animationDelay + "s");
		animationDelay += 0.25;
		element.appendTo("#answers");
	}
}

function characterQuestion(answerCharacter) {
	hasAnswered = false;
	var charimg = answerCharacter.filename;
	$("#image").css("background-image", "url("+charimg+")");
	var question = randomRange(answerCharacter.questions.length);
	$("#question").text(answerCharacter.questions[question].question);
	var answers = answerCharacter.questions[question].answers;
	answerText = answerCharacter.questions[question].answertext;
	var answerList = [];
	for (idx in answers) {
		var element = $(`<div class="answer alternative">${answers[idx]}</div>`);
		if (idx == 0) {
			rightAnswer = element;
		}
		(function(index) {
			element.click(function(event) {
				answerClick(event, index);
			});
			answerList.push(element);
		})(idx);
	}
	var animationDelay = 1;
	while (answerList.length > 0) {
		var index = randomRange(answerList.length);
		var element = answerList.splice(index, 1)[0]
		element.css("animation-delay", animationDelay + "s");
		animationDelay += 0.25;
		element.appendTo("#answers");
	}
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
	$("#question").css("animation", "fade-out 1s");
	$("#question").css("animation-fill-mode", "forwards");
	setTimeout(() => {
		$("#answers").empty();
		$("#answertext").text("");
		$("#question").css("animation", "");
		$("#question").text("");
		gameStep.next();
	}, 1500);
}
