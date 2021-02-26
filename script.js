function randomRange(excludedMax) {
	return Math.floor(Math.random() * excludedMax);
}

function getRandomCharacter() {
	id = randomRange(data.characters.length);
	character = data.characters[id];
	character.id = id;
	return character;
}

$(document).ready(function(e) {
	characterQuestion();
	$("#next > div").click(nextClick);
});

function characterQuestion() {
	hasAnswered = false;
	character = getRandomCharacter();
	charimg = character.filename;
	$("#image").css("background-image", "url("+charimg+")");
	var question = randomRange(character.questions.length);
	$("#question").text(character.questions[question].question);
	var answers = character.questions[question].answers;
	answerText = character.questions[question].answertext;
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
		characterQuestion();
	}, 1500);
}
