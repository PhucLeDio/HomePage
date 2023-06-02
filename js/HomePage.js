/* content */
let prevScrollPos = window.pageYOffset;
window.onscroll = function () {
	let currentScrollPos = window.pageYOffset;
	if (prevScrollPos > currentScrollPos) {
		document.querySelector('.navbar-scroll-hide').style.top = "0";
	} else {
		document.querySelector('.navbar-scroll-hide').style.top = "-100px"; /* Adjust this value based on your navbar height */
	}
	prevScrollPos = currentScrollPos;
}

/* ALL effect to climate */
const reviewWrap = document.getElementById("reviewWrap");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const imgDiv = document.getElementById("imgDiv");
const personName = document.getElementById("personName");
const profession = document.getElementById("profession");
const description = document.getElementById("description");
const surpriseMeBtn = document.getElementById("surpriseMeBtn");
const chicken = document.querySelector(".chicken");

let isChickenVisible;

let people = [
	{
		photo:
			'url("https://assets.editorial.aetnd.com/uploads/2009/12/gettyimages-3200846.jpg")',
		name: "Lady Bird Johnson",
		profession: "Former First Lady of the United States",
		description:
			"The environment is where we all meet; where all have a mutual interest; it is the one thing all of us share."
	},

	{
		photo:
			"url('https://lincolnlandscapinginc.com/wp-content/uploads/2015/11/chief-seattle.jpg')",
		name: "Chief Seattle",
		profession: "Suquamish and Duwamish chief",
		description:
			"The earth does not belong to us. We belong to the earth."
	},

	{
		photo:
			"url('https://images.newscientist.com/wp-content/uploads/2021/10/28121524/PRI_207222975.jpg')",
		name: "Native American Proverb",
		description:
			"We do not inherit the Earth from our ancestors; we borrow it from our children."
	},

	{
		photo:
			"url('https://londonspeakerbureau.com/wp-content/uploads/2017/04/keynote-speaker-robert-swan.png')",
		name: "Robert Swan",
		profession: "Polar explorer",
		description:
			"The greatest threat to our planet is the belief that someone else will save it."
	}
];

imgDiv.style.backgroundImage = people[0].photo;
personName.innerText = people[0].name;
profession.innerText = people[0].profession;
description.innerText = people[0].description;
let currentPerson = 0;

//Select the side where you want to slide
function slide(whichSide, personNumber) {
	let reviewWrapWidth = reviewWrap.offsetWidth + "px";
	let descriptionHeight = description.offsetHeight + "px";
	//(+ or -)
	let side1symbol = whichSide === "left" ? "" : "-";
	let side2symbol = whichSide === "left" ? "-" : "";

	let tl = gsap.timeline();

	if (isChickenVisible) {
		tl.to(chicken, {
			duration: 0.4,
			opacity: 0
		});
	}

	tl.to(reviewWrap, {
		duration: 0.4,
		opacity: 0,
		translateX: `${side1symbol + reviewWrapWidth}`
	});

	tl.to(reviewWrap, {
		duration: 0,
		translateX: `${side2symbol + reviewWrapWidth}`
	});

	setTimeout(() => {
		imgDiv.style.backgroundImage = people[personNumber].photo;
	}, 400);
	setTimeout(() => {
		description.style.height = descriptionHeight;
	}, 400);
	setTimeout(() => {
		personName.innerText = people[personNumber].name;
	}, 400);
	setTimeout(() => {
		profession.innerText = people[personNumber].profession;
	}, 400);
	setTimeout(() => {
		description.innerText = people[personNumber].description;
	}, 400);

	tl.to(reviewWrap, {
		duration: 0.4,
		opacity: 1,
		translateX: 0
	});

	if (isChickenVisible) {
		tl.to(chicken, {
			duration: 0.4,
			opacity: 1
		});
	}
}

function setNextCardLeft() {
	if (currentPerson === 3) {
		currentPerson = 0;
		slide("left", currentPerson);
	} else {
		currentPerson++;
	}

	slide("left", currentPerson);
}

function setNextCardRight() {
	if (currentPerson === 0) {
		currentPerson = 3;
		slide("right", currentPerson);
	} else {
		currentPerson--;
	}

	slide("right", currentPerson);
}

leftArrow.addEventListener("click", setNextCardLeft);
rightArrow.addEventListener("click", setNextCardRight);

surpriseMeBtn.addEventListener("click", () => {
	if (chicken.style.opacity === "0") {
		chicken.style.opacity = "1";
		imgDiv.classList.add("move-head");
		surpriseMeBtn.innerText = "Remove the chicken";
		surpriseMeBtn.classList.remove("surprise-me-btn");
		surpriseMeBtn.classList.add("hide-chicken-btn");
		isChickenVisible = true;
	} else if (chicken.style.opacity === "1") {
		chicken.style.opacity = "0";
		imgDiv.classList.remove("move-head");
		surpriseMeBtn.innerText = "Surprise me";
		surpriseMeBtn.classList.add("surprise-me-btn");
		surpriseMeBtn.classList.remove("hide-chicken-btn");
		isChickenVisible = false;
	}
});

window.addEventListener("resize", () => {
	description.style.height = "100%";
});


/* parallax */
class TextScramble {
	constructor(el) {
		this.el = el;
		this.chars = '!<>-_\\/[]{}—=+*^?#________';
		this.update = this.update.bind(this);
	}

	setText(newText) {
		const oldText = this.el.innerText;
		const length = Math.max(oldText.length, newText.length);
		const promise = new Promise((resolve) => this.resolve = resolve);
		this.queue = [];

		for (let i = 0; i < length; i++) {
			const from = oldText[i] || '';
			const to = newText[i] || '';
			const start = Math.floor(Math.random() * 40);
			const end = start + Math.floor(Math.random() * 40);
			this.queue.push({ from, to, start, end });
		}

		cancelAnimationFrame(this.frameRequest);
		this.frame = 0;
		this.update();
		return promise;
	}

	update() {
		let output = '';
		let complete = 0;

		for (let i = 0, n = this.queue.length; i < n; i++) {
			let { from, to, start, end, char } = this.queue[i];

			if (this.frame >= end) {
				complete++;
				output += to;
			} else if (this.frame >= start) {
				if (!char || Math.random() < 0.28) {
					char = this.randomChar();
					this.queue[i].char = char;
				}
				output += `<span class="dud">${char}</span>`;
			} else {
				output += from;
			}
		}

		this.el.innerHTML = output;

		if (complete === this.queue.length) {
			this.resolve();
		} else {
			this.frameRequest = requestAnimationFrame(this.update);
			this.frame++;
		}
	}

	randomChar() {
		return this.chars[Math.floor(Math.random() * this.chars.length)];
	}
}

const phrases = [
	'Save the environment: Protect our home, preserve its beauty.',
	'Act now: Secure a healthy planet for future generations.',
	"Preserve biodiversity: Save the wonders of nature.",
	'Protect our well-being: Clean air, water, and food depend on it.',
	"Halt destruction: Restore balance, save habitats and species.",
	'Preserve nature beauty: Ensure future generations experience its wonders.',
	'Improve mental health: Save the environment, find solace in nature.'
];

const el = document.querySelector('.text-scramble');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
	fx.setText(phrases[counter]).then(() => {
		setTimeout(next, 800);
	});
	counter = (counter + 1) % phrases.length;
};

next();

/*-------------------- CHART ------------------------*/

/* CO2 */
const ctx = document.getElementById('myChart-1');

new Chart(ctx, {
	type: 'line',
	data: {
		labels: ['1750', '1780', '1810', '1840', '1870', '1900', '1930', '1960', '1990', '2020'],
		datasets: [{
			label: 'CO2 Concentration (ppm)',
			data: [280, 280, 280, 280, 290, 300, 310, 315, 353, 414],
			borderWidth: 2
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: false
			}
		}
	}
});

/* Temperature */
const ctx2 = document.getElementById('myChart-2');

new Chart(ctx2, {
	type: 'line',
	data: {
		labels: ['1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020', '2022'],
		datasets: [{
			label: 'Global temperature (°C)',
			data: [13.9, 13.9, 13.9, 14.1, 14.3, 14.4, 14.5, 14.6, 14.9, 15.1],
			borderWidth: 2
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: false
			}
		}
	}
});

/* Methane */
const ctx3 = document.getElementById('myChart-3');

new Chart(ctx3, {
	type: 'bar',
	data: {
		labels: ['1750', '2011', '2021', '2022', '2023'],
		datasets: [{
			label: 'Methane Concentration (ppm)',
			data: [722.25, 1803.1, 1891.6, 1909.6, 1926.6],
			borderWidth: 2
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: false
			}
		}
	}
});

/* Sea level */
const ctx4 = document.getElementById('myChart-4');

new Chart(ctx4, {
	type: 'bar',
	data: {
		labels: ['1901', '2006-2018', '2019-2022', '2023'],
		datasets: [{
			label: 'Sea level increase (inches)',
			data: [1.7, 3.25, 3.4, 4],
			borderWidth: 2
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}
});

/* Ice sheets */
const ctx5 = document.getElementById('myChart-5');

new Chart(ctx5, {
	type: 'bar',
	data: {
		labels: ['2000', '2004', '2015-2019', '2023'],
		datasets: [{
			label: 'Ice sheet melt down (billions tons)',
			data: [225, 250, 328.5, 424],
			borderWidth: 2
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}
});

/* lastest news */
$(document).ready(function () {
	$('.post-wrapper').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		nextArrow: $('.next'),
		prevArrow: $('.pre'),
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
			// You can unslick at a given breakpoint now by adding:
			// settings: "unslick"
			// instead of a settings object
		]
	});
});

/* FOOTER */
new svgMap({
	targetElementID: 'svgMap',
	data: {
		data: {
			gdp: {
				name: 'GDP per capita',
				format: '{0} USD',
				thousandSeparator: ',',
				thresholdMax: 50000,
				thresholdMin: 1000
			},
			change: {
				name: 'Change to year before',
				format: '{0} %'
			}
		},
		applyData: 'gdp',
		values: {
			AF: { gdp: 587, change: 4.73 },
			AL: { gdp: 4583, change: 11.09 },
			DZ: { gdp: 4293, change: 10.01 }
			// ...
		}
	}
});

