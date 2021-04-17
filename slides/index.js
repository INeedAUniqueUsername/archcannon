let slide = $('#slide');

function navigateHref() {
	let anchor = location.href.indexOf("#");
	if (anchor > -1) {
		anchor = location.href.substring(anchor + 1);
		navigateSlide(anchor)
	}
}
function init() {
	let anchor = location.href.indexOf("#");
	if (anchor > -1) {
		anchor = location.href.substring(anchor + 1);
		navigateSlide(anchor)
	} else {
		anchor = location.href + '#1';
		location.href = anchor;
	}
	window.addEventListener('hashchange', function () {
		let anchor = location.href.indexOf("#");
		if (anchor > -1) {
			anchor = location.href.substring(anchor + 1);
			navigateSlide(anchor)
		}
	})
}
function navigateSlide(index) {
	let s = $(`#slide${index}`);
	if (!s.length) {
		return;
	}


	console.log(`navigate slide: ${index}`)
	slide.html(s.html());
	slide.off('click')
	slide.click(function () {
		let next = parseInt(index) + 1;
		console.log('click: ' + next)
		if ($(`#slide${next}`).length == 0) {
			return;
		}
		let link = location.href;
		let i = link.indexOf('#')
		if (i > -1) {
			link = link.substring(0, i);
		}
		link += `#${next}`;
		window.location = link;
	});

	function onkeypress(event) {
		let k = event.which;
		console.log('keypress: ' + k)
		switch (k) {
			case 13: //Enter
			case 39: //Right
				navigateSlide(index + 1);
				break;
			case 37: //Left
				navigateSlide(index - 1);
				break;
		}
	}
}