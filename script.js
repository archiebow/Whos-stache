
// Utility functions

function randomRange(excludedMax) {
	return Math.floor(Math.random() * excludedMax);
}

function getRandomElement(array) {
	return array[randomRange(array.length)];
}

function getRandomCharacter(characterSelection) {
	return characterSelection ? getRandomElement(characterSelection) : getRandomElement(data.characters);
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

function addTag(tag) {
	if (tags[tag] == null) {
		tags[tag] = 0;
	}
	tags[tag]++;
}

function scanTags(data) {
	data.characters.forEach(character => character.tags.forEach(tag => addTag(tag)));
}

function filterCharacters(tagList) {
	return data.characters.filter(character => character.tags.some(tag => tagList.indexOf(tag) != -1));
}


// Initialization
var audio = new Audio("Macho Man.mp3");
var points = 0;
$(document).ready(function(e) {
	tags = {};
	scanTags(data);
});


// Game functions

function* game(characterSelection) {
	$("#points").text("Score: " + points);
	var characters = selectCharacters(10, characterSelection);
	for (idx in characters) {
		var character = characters[idx];
		stacheQuestion(character, characterSelection);
		yield;
		characterQuestion(character);
		yield;
	}
	showEndScreen();
}

function selectCharacters(count=10, characterSelection) {
	var characters = [];
	while (characters.length < count) {
		var character = getRandomCharacter(characterSelection);
		if (characterSelection) {
			if (characterSelection.length > count) {
				if (characters.indexOf(character) == -1) {
					characters.push(character);
				}
			} else {
				characters.push(character);
			}
		} else if (data.characters.length >= count) {
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

function stacheQuestion(answerCharacter, characterSelection) {
	hasAnswered = false;
	// Add the right character to the list of options
	var names = [answerCharacter.name];
	while (names.length < 3) {
		var name = getRandomCharacter(characterSelection).name;
		// Check if name already in selection
		if (names.indexOf(name) == -1) {
			names.push(name);
		}
	}
	var charimg = answerCharacter.croppedfilename;
	uncroppedimg = answerCharacter.filename;
	$("#imagefull").css("background-image", "");
	$("#imagefull").removeClass("opaque");
	$("#image").css("background-image", "url("+charimg+")");

	bioText = answerCharacter.bio
	answerText = "Fun Fact: " + getRandomElement(answerCharacter.funfacts)
	generateAnswerButtons(names);
}

function characterQuestion(answerCharacter) {
	hasAnswered = false;
	var charimg = answerCharacter.filename;
	$("#image").css("background-image", "url("+charimg+")");
	$("#imagefull").css("background-image", "");
	$("#imagefull").removeClass("opaque");
	var question = getRandomElement(answerCharacter.questions);
	$("#question").text(question.question);
	var answers = question.answers;
	answerText = question.answertext;
	bioText = ""
	generateAnswerButtons(answers);
}


// UI functions

function answerClick(event, answer) {
	if (!hasAnswered) {
		hasAnswered = true;
		if (answer == 0) {
			$(event.target).addClass("right");
			rightAnsSound()
			points += 10;
			$("#points").text("Score: " + points);
		} else {
			$(event.target).addClass("wrong");
			rightAnswer.addClass("right");
			wrongAnsSound()
			points -= 5;
			$("#points").text("Score: " + points);
		}
		$("#biotext").text(bioText);
		$("#biotext").css("animation", "fade-in 1s");
		$("#answertext").text(answerText);
		$("#answertext").css("animation", "fade-in 1s");
		$("#next").removeClass("hidden");
		$("#next > div").css("animation-name", "slide-in");
		$("#next > div").css("animation-timing-function", "ease-out");
		$("#imagefull").css("background-image", "url("+uncroppedimg+")");
		$("#imagefull").addClass("opaque");
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

function newgame() {
	$("#menu").css("display", "none");
	$("#gamemenu").css("display", "block");
	$("#back").css("display", "block");
	$("#characters").empty();
	$("#charCount").text(0)
	myPlay()
	Object.keys(tags).sort().forEach((tag) => {
		if (tags[tag] > 2) {
			var element = $(`<div class="button tag"><span class="checkbox"></span>${tag} (${tags[tag]})</div>`);
			(function(tag) {
				// Bind onClick event to our function
				element.click(function(event) {
					tagClick(event, tag);
				});
			})(tag);
			element.appendTo("#characters");
		}
	});
	selection = [];
}

function credits() {
	$("#menu").css("display", "none");
	$("#credits").css("display", "block");
	$("#back").css("display", "block");
}

function instructions() {
	$("#menu").css("display", "none");
	$("#instructions").css("display", "block");
	$("#back").css("display", "block");
}

function back() {
	$("#gamemenu").css("display", "none");
	$("#credits").css("display", "none");
	$("#instructions").css("display", "none");
	$("#back").css("display", "none");
	$("#menu").css("display", "block");
	$("#endscreen").css("display", "none");
	$("#points").text("");
	audio.pause();
	audio.currentTime = 0
}

function tagClick(event, tag) {
	if (selection.indexOf(tag) != -1) {
		$(event.target).find("> span").html("");
		selection.splice(selection.indexOf(tag), 1);
	} else {
		selection.push(tag);
		$(event.target).find("> span").append($(`<img src="stache.png" />`));
	}
	$("#charCount").text(filterCharacters(selection).length);
}

function start() {
	if (filterCharacters(selection).length >= 10) {
		$("#gamemenu").css("display", "none");
		$("#back").css("display", "none");
		gameStep = game(filterCharacters(selection));
		gameStep.next();
	} else {
		alert("Please select more categories.")
	}
}

function showEndScreen() {
	$("#endscreen").css("display", "block");
	$("#points").text("");
	$("#endscreen").text("Game Over! You got: " + points + " Points. Thanks for playing Who's Stache!");
	$("#back").css("display", "block");
	$("#image").css("background-image", "");
	$("#imagefull").css("background-image", "");
	$("#imagefull").removeClass("opaque");
	winSound()
}

function myPlay(){
    audio.play();
}
function rightAnsSound(){
	var rightsound = new Audio("rightans.wav");
    rightsound.play();
}

function wrongAnsSound(){
	var wrongsound = new Audio("wrongans.wav");
    wrongsound.play();
}

function winSound(){
	var winsound = new Audio("Tada-sound.mp3");
	audio.pause();
	audio.currentTime = 0
    winsound.play();
}
