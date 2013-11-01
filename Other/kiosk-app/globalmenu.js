//Define call-backs for menu buttons
function goHome() {
	window.location='../index.html';
}

window.addEventListener("load", function() {
	if(swipemenu) {
		//Optional: override default menu height (default = 70px)
		swipemenu.setMenuHeight(70);
		
		//Required: Add menu buttons (can be text, images, or a mix of both):
		//	params (title, callback, alignRight, imagePath)
		swipemenu.addButton("Go Home", goHome, false, "../images/home.png");
		swipemenu.addButton("Close", swipemenu.close, true, "../images/cancel.png");
		/*
		icon_options.png, icon_reset.png and icon_rules.png (Public Domain) courtesy of Rory Craig-Barnes
		https://github.com/glasspear/WebWorks-CodeSamples
		
		monkey-icon.png (Freeware, allowed commercial usage) courtesy of Martin Berube:
		http://www.iconarchive.com/show/animal-icons-by-martin-berube/monkey-icon.html
		*/
	}
}, false);