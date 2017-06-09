/**
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
	// Helper vars and functions.
	const extend = function(a, b) {
		for( let key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	};

	// from http://www.quirksmode.org/js/events_properties.html#position
	const getMousePos = function(ev) {
		let posx = 0;
		let posy = 0;
		if (!ev) ev = window.event;
		if (ev.pageX || ev.pageY) 	{
			posx = ev.pageX;
			posy = ev.pageY;
		}
		else if (ev.clientX || ev.clientY) 	{
			posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x : posx, y : posy };
	};

	const TiltObj = function(el, options) {
		this.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
		this.DOM = {};
		this.DOM.img = this.el.querySelector('.project-parallax-img');
		this.DOM.title = this.el.querySelector('.project-parallax-decor');
		this._initEvents();
	};

	TiltObj.prototype.options = {
		movement: {
			img : { translation : {x: -10, y: -10} },
			title : { translation : {x: 25, y: 25} },
		}
	};

	TiltObj.prototype._initEvents = function() {
		this.mouseenterFn = (ev) => {
			anime.remove(this.DOM.img);
			anime.remove(this.DOM.title);
		};

		this.mousemoveFn = (ev) => {
			requestAnimationFrame(() => this._layout(ev));
		};

		this.mouseleaveFn = (ev) => {
			requestAnimationFrame(() => {
				anime({
					targets: [this.DOM.img, this.DOM.title],
					duration: 1500,
					easing: 'easeOutElastic',
					elasticity: 400,
					translateX: 0,
					translateY: 0
				});
			});
		};

		this.el.addEventListener('mousemove', this.mousemoveFn);
		this.el.addEventListener('mouseleave', this.mouseleaveFn);
		this.el.addEventListener('mouseenter', this.mouseenterFn);
	};

	TiltObj.prototype._layout = function(ev) {
		// Mouse position relative to the document.
		const mousepos = getMousePos(ev);
		// Document scrolls.
		const docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop};
		const bounds = this.el.getBoundingClientRect();
		// Mouse position relative to the main element (this.DOM.el).
		const relmousepos = { x : mousepos.x - bounds.left - docScrolls.left, y : mousepos.y - bounds.top - docScrolls.top };

		// Movement settings for the animatable elements.
		const t = {
			img: this.options.movement.img.translation,
			title: this.options.movement.title.translation,
		};

		const transforms = {
			img : {
				x: (-1*t.img.x - t.img.x)/bounds.width*relmousepos.x + t.img.x,
				y: (-1*t.img.y - t.img.y)/bounds.height*relmousepos.y + t.img.y
			},
			title : {
				x: (-1*t.title.x - t.title.x)/bounds.width*relmousepos.x + t.title.x,
				y: (-1*t.title.y - t.title.y)/bounds.height*relmousepos.y + t.title.y
			}
		};
		this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform = 'translateX(' + transforms.img.x + 'px) translateY(' + transforms.img.y + 'px)';
		this.DOM.title.style.WebkitTransform = this.DOM.title.style.transform = 'translateX(' + transforms.title.x + 'px) translateY(' + transforms.title.y + 'px)';
	};

	const DOM = {};
	DOM.svg = document.querySelector('.morph');
	DOM.contentElems = Array.from(document.querySelectorAll('.project-parallax'));
	DOM.contentLinks = Array.from(document.querySelectorAll('.content__link'));
	const contentElemsTotal = DOM.contentElems.length;
	const shapes = [
		// footer shape:
		{
			path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
			pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
			scaleX: 2.5,
			scaleY: 2,
			rotate: 0,
			tx: 0,
			ty: -50,
			fill: {
				color: '#282faf',
				duration: 500,
				easing: 'linear'
			},
			animation: {
				path: {
					duration: 3000,
					easing: 'easeOutQuad',
					elasticity: 600
				},
				svg: {
					duration: 3000,
					easing: 'easeOutElastic'
				}
			}
		}
	];
	let step;

	const initShapeLoop = function(pos) {
		pos = pos || 0;
		anime.remove(DOM.shapeEl);
		anime({
			targets: DOM.shapeEl,
			easing: 'linear',
			loop: true,
			fill: {
				value: shapes[pos].fill.color,
				duration: shapes[pos].fill.duration,
				easing: shapes[pos].fill.easing
			},
			direction: 'alternate'
		});
	};

	const initShapeEl = function() {
		anime.remove(DOM.svg);
		anime({
			targets: DOM.svg,
			duration: 1,
			easing: 'linear',
			scaleX: shapes[0].scaleX,
			scaleY: shapes[0].scaleY,
			translateX: shapes[0].tx+'px',
			translateY: shapes[0].ty+'px',
			rotate: shapes[0].rotate+'deg'
		});

		initShapeLoop();
	};

	const init = function() {
		imagesLoaded(document.body, () => {
			initShapeEl();
			Array.from(document.querySelectorAll('.project-parallax-layout')).forEach(el => new TiltObj(el));
		});
	}

	init();
};
