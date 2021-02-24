//Setting Defaults
var defaultColor = "blue";
var defaultDataFormat = "1";
var defaultUrlOp = "1";
var defaultNetworking = "1";
var defaultDateTime = "1";
var defaultExtractors = "1";
var defaultMisc = "1";


function loadOptions() {
	var favColor = localStorage["favColor"];

	// valid colors are red, blue, green and yellow
	if (favColor == undefined || (favColor != "red" && favColor != "blue" && favColor != "green" && favColor != "yellow")) {
		favColor = defaultColor;
	}

	var select = document.getElementById("color");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value == favColor) {
			child.selected = "true";
			break;
		}
	}
}

function saveOptions() {
	var select = document.getElementById("color");
	var color = select.children[select.selectedIndex].value;
	localStorage["favColor"] = color;
}

function eraseOptions() {
	localStorage.removeItem("favColor");
	location.reload();
}