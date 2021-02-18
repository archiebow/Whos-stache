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
});

function characterQuestion() {
	hasAnswered = false;
	character = getRandomCharacter();
	console.log(character);
	console.log(character.name, character.id);
	$("#image").css("background-image", "url('stash.jpg')");
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
	while (answerList.length > 0) {
		var index = randomRange(answerList.length);
		var element = answerList.splice(index, 1)[0]
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
		var answerElements = $(".answer");
		$("#answertext").text(answerText);
		$("#answertext").css("animation", "fade-in 1s");
		$("#answers").empty();
		$("#answertext").text("");
		characterQuestion();
	}
}
