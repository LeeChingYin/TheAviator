require("../css/style.css");

var reclac = function() {
	var _html = document.documentElement,
		clientWidth = document.documentElement.clientWidth;
	_html.style.fontSize = 50 * (clientWidth / 320) + 'px';
};
reclac();
window.addEventListener('resize', reclac, false);