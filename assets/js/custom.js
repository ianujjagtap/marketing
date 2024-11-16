/*-----------------------------------------------------------------------------------

    Template Name: landio


    Note: This is Custom Js file

-----------------------------------------------------------------------------------

    [Table of contents]
    
    1. logodata
    2. clients-slider
    3. stickyHeader
    4. accordion-item
    5. Go to top
    6. loaded
    7. sidebar css

-----------------------------------------------------------------------------------*/

/* 1. logodata */
jQuery(document).ready(($) => {
	if ($.isFunction($.fn.owlCarousel)) {
		$(".quotation").owlCarousel({
			loop: true,
			dot: true,
			nav: false,
			autoplay: true,
			items: 1,
			autoplayTimeout: 3000,
		});

		/* 2. clients-slider */
		$(".clients-slider").owlCarousel({
			loop: true,
			dot: false,
			nav: false,
			autoplay: true,
			autoplayTimeout: 3000,
			responsive: {
				0: {
					items: 1,
				},
				600: {
					items: 2,
				},
				993: {
					items: 4,
				},
				1200: {
					items: 5,
				},
			},
		});
	}
});

/* 3. stickyHeader */
if ($("#stickyHeader")[0]) {
	let new_scroll_position = 0;

	let last_scroll_position;

	const header = document.getElementById("stickyHeader");

	window.addEventListener("scroll", (e) => {
		last_scroll_position = window.scrollY;

		if (
			new_scroll_position < last_scroll_position &&
			last_scroll_position > 100
		) {
			header.classList.remove("slideUp");

			header.classList.add("slideUp");
		} else if (last_scroll_position < 100) {
			header.classList.remove("slideUp");
		} else if (new_scroll_position > last_scroll_position) {
			header.classList.remove("slideUp");

			header.classList.add("slideUp");
		}

		new_scroll_position = last_scroll_position;
	});
}

/* 4. accordion-item */
$(".accordion-item .heading").on("click", function (e) {
	e.preventDefault();

	if ($(this).closest(".accordion-item").hasClass("active")) {
		$(".accordion-item").removeClass("active");
	} else {
		$(".accordion-item").removeClass("active");

		$(this).closest(".accordion-item").addClass("active");
	}
	const $content = $(this).next();
	$content.slideToggle(100);
	$(".accordion-item .content").not($content).slideUp("fast");
});

/* 5. Go to top */
function inVisible(element) {
	//Checking if the element is
	//visible in the viewport
	const WindowTop = $(window).scrollTop();
	const WindowBottom = WindowTop + $(window).height();
	const ElementTop = element.offset().top;
	const ElementBottom = ElementTop + element.height();
	//animating the element if it is
	//visible in the viewport
	if (ElementBottom <= WindowBottom && ElementTop >= WindowTop)
		animate(element);
}

function animate(element) {
	//Animating the element if not animated before
	if (!element.hasClass("ms-animated")) {
		const maxval = element.data("max");
		const html = element.html();
		element.addClass("ms-animated");
		$({
			countNum: element.html(),
		}).animate(
			{
				countNum: maxval,
			},
			{
				//duration 5 seconds
				duration: 5000,
				easing: "linear",
				step: function () {
					element.html(Math.floor(this.countNum) + html);
				},
				complete: function () {
					element.html(this.countNum + html);
				},
			},
		);
	}
}

//When the document is ready
$(() => {
	//This is triggered when the
	//user scrolls the page
	$(window).scroll(() => {
		//Checking if each items to animate are
		//visible in the viewport
		$("h2[data-max]").each(function () {
			inVisible($(this));
		});
	});
});

const calcScrollValue = () => {
	const scrollProgress = document.getElementById("progress");
	const progressValue = document.getElementById("progress-value");
	const pos = document.documentElement.scrollTop;
	const calcHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	const scrollValue = Math.round((pos * 100) / calcHeight);
	if (pos > 100) {
		scrollProgress.style.display = "grid";
	} else {
		scrollProgress.style.display = "none";
	}
	scrollProgress.addEventListener("click", () => {
		document.documentElement.scrollTop = 0;
	});
	scrollProgress.style.background = `conic-gradient(#000 ${scrollValue}%, #ffffff00 ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// 6. loaded

$(window).on("load", () => {
	$("body").addClass("page-loaded");
	("loaded");
});

// 7. sidebar css

function openNav() {
	document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
	document.getElementById("mySidebar").style.width = "0";
}

document.addEventListener("click", () =>{

})

// Close the sidebar when clicking outside of it
document.addEventListener("click", (event) => {
    const sidebar = document.getElementById("mySidebar");
    const openbtn = document.querySelector(".openbtn");
    const isSpanInAnchor = event.target.tagName === 'SPAN' && event.target.closest('a');

    if (!sidebar.contains(event.target) && event.target !== openbtn || isSpanInAnchor) {
        closeNav();
    }
});

// Adjust sidebar based on screen size
window.addEventListener("resize", () => {
	if (window.innerWidth > 768) {
		document.getElementById("mySidebar").style.width = "0";
	}
});


