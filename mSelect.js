/**
 * LBS mSelect
 * Date: 2015-4-15
 * ===================================================
 * *选项 属性*
 * opts.mode 自带数据模式 可选('date'--日期  'time'--时间)
 * opts.data 数据列表 
 	日期模式提供自带日期列表数据
 	时间模式提供自带时间列表数据
 	如未设置模式选项 则必须提供数据
 * opts.align 对齐方式 可选('top' 'center' 'bottom') 
 	 如未设置对齐选项
 	 日期模式下对齐到当前年月日
 	 时间模式下对齐到当前小时分钟
 	 其他默认对齐'top'
 * opts.title UI标题文本
 * opts.cssUrl 对应的css文件路径 方便更换UI皮肤
 	默认与mSelect.js同路径目录 ('mSelect.js' || 'mSelect.css')
 * opts.parent UI插入到哪里 默认 body
 * opts.boxClass 半透明标签的类名 默认'mSelect-box'
 * opts.containerClass 实际包裹容器标签类名 默认'mSelect-container'
 * opts.headClass 头部标签类名 默认'mSelect-head'
 * opts.contentClass 中间内容标签类名 默认'mSelect-content'
 * opts.wrapperClass 每项包裹标签类名 默认'mSelect-wrapper'
 * opts.scrollerClass 每项滚动标签类名 默认'mSelect-scroller'
 * opts.suffixClass 每项修饰词标签类名 默认'mSelect-suffix'
 * opts.maskClass 每项渐变标签类名 默认'mSelect-mask'
 * opts.footClass 底部标签类名 默认'mSelect-foot'
 * opts.defineClass 确定按钮标签类名 默认'mSelect-define'
 * opts.cancelClass 取消按钮标签类名 默认'mSelect-cancel'
 * *选项 方法*
 * opts.select 点击确定后执行函数
 * ===================================================
 * *实例 方法*
 * this.show 显示方法
 * this.hide 隐藏方法
 * ===================================================
 **/
(function(root, factory) {
	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define('mSelect', function() {
			return factory();
		});
	} else {
		root.mSelect = factory();
	}
})(this, function() {
	'use strict';

	var d = document,
		body = d.body,
		div = d.createElement('div'),
		style = div.style,
		vendors = ['webkit', 'Moz', 'ms', 'O'],
		i = 0,
		l = vendors.length,
		toHumb = function(str) {
			return str.replace(/-\D/g, function(match) {
				return match.charAt(1).toUpperCase();
			});
		};

	var on = function(el, type, fn) {
		if (typeof type === 'string') return el.addEventListener(type, fn, false);
		for (var i = 0, l = type.length; i < l; i++) el.addEventListener(type[i], fn, false);
	};

	var prefix = function(property) {
		var prop = toHumb(property);
		if (prop in style) return prop;
		for (i = 0; i < l; i++) {
			prop = toHumb(vendors[i] + '-' + property);
			if (prop in style) return prop;
		}
		return null;
	};

	var supportCss = function(property) {
		var prop = toHumb(property);
		if (prop in style) return true;
		for (i = 0; i < l; i++) {
			prop = toHumb(vendors[i] + '-' + property);
			if (prop in style) return true;
		}
		return false;
	};

	var support3d = function() {
		var has3d, transform;
		body.appendChild(div);
		if (supportCss('transform')) {
			transform = prefix('transform');
			div.style[transform] = 'translate3d(1px,1px,1px)';
			has3d = window.getComputedStyle(div, null)[transform];
		}
		body.removeChild(div);
		return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
	};

	var momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;
		deceleration = deceleration === undefined ? 0.0006 : deceleration;
		// 初速度为0 距离等于速度的平方除以2倍加速度
		destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
		// 初始时间为0，初始速度为0 时间等于速度除以加速度
		duration = speed / deceleration;
		if (destination < lowerMargin) {
			destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if (destination > 0) {
			destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}
		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var loadCSS = function(url) {
		var head = d.getElementsByTagName('head')[0],
			link = d.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;
		head.appendChild(link);
	};

	var prefixTransition = prefix('transition');
	var prefixTransform = prefix('transform');
	var hasTransition = supportCss('transition');
	var hasTransform2d = supportCss('transform');
	var hasTransform3d = support3d();

	var mScroll = function(el) {
		var scroller = el.children[0];
		var wrapperH = el.offsetHeight;
		var scrollerH = scroller.offsetHeight;
		var maxScrollY = wrapperH - scrollerH;
		var length = scroller.children.length;
		var singleH = Math.floor(scrollerH / length);

		var startY = 0;
		var moveY = null;
		var sy = 0;
		var scrollY = 0;
		var startTime = 0;
		var aTimer = null;
		var moved = false;

		el._index = 0; //对应index

		var transation = function(t) {
			scroller.style[prefixTransition] = 'all ' + t + 'ms';
		};
		var translate = function(v) {
			if (hasTransform3d) {
				scroller.style[prefixTransform] = 'translate3d(0px,' + v + 'px,0px)';
			} else if (hasTransform2d) {
				scroller.style[prefixTransform] = 'translate(0px,' + v + 'px)';
			} else {
				scroller.style.top = v + 'px';
			}
			sy = v;
		};
		var transitionEnd = function() {
			transation(0);
			if (!resetPosition()) return;
			resetInteger();
		};
		var animate = function(y, time) {
			var startY = sy,
				changeY = y - startY,
				startTime = Date.now(),
				duration = time,
				easefn = function(k) {
					return Math.sqrt(1 - (--k * k));
				};
			! function step() {
				var nowTime = Date.now(),
					timestamp = nowTime - startTime,
					delta = easefn(timestamp / duration),
					nowY = startY + delta * changeY;
				translate(nowY);
				if (timestamp >= duration) {
					translate(y);
					transitionEnd();
					return;
				}
				aTimer = setTimeout(step, 10);
			}();
		};
		var scrollTo = function(v, t) {
			if (hasTransition) {
				transation(t);
				translate(v);
			} else {
				animate(v, t);
			}
		};
		var resetPosition = function() {
			if (sy > 0) {
				scrollTo(0, 600);
				return false;
			} else if (sy < maxScrollY) {
				scrollTo(maxScrollY, 600);
				return false;
			}
			return true;
		};
		var resetInteger = function() {
			var nowIndex = Math.round(sy / singleH);
			var nowY = nowIndex * singleH;
			el._index = Math.abs(nowIndex);
			if (sy / singleH === parseInt(sy / singleH)) return;
			scrollTo(nowY, 600);
		};
		var touchstart = function(e) {
			startY = e.touches ? e.touches[0].pageY : e.pageY;
			moved = true;
			moveY = null;
			scrollY = sy;
			startTime = Date.now();
			hasTransition ? transation(0) : clearTimeout(aTimer);
		};
		var touchmove = function(e) {
			e.preventDefault();
			if (!moved) return;
			var _timestamp = Date.now();
			var _moveY = e.touches ? e.touches[0].pageY : e.pageY;
			var _deltaY = moveY === null ? 0 : _moveY - moveY;
			if (sy > 0 || sy < maxScrollY) _deltaY /= 4;
			translate(sy + _deltaY);
			moveY = _moveY;
			if (_timestamp - startTime > 300) {
				startTime = _timestamp;
				scrollY = sy;
			}
		};
		var touchend = function() {
			moved = false;
			var duration = Date.now() - startTime;
			if (moveY === null) return;
			if (!resetPosition()) return;
			if (duration < 300 && Math.abs(moveY - startY) > 10) {
				var mm = momentum(sy, scrollY, duration, maxScrollY, wrapperH);
				var nowY = Math.round(mm.destination);
				var nowTime = Math.round(mm.duration);
				var nowIndex = Math.round(nowY / singleH);
				el._index = Math.abs(nowIndex);
				if (nowTime < 400) nowTime = 400;
				scrollTo(nowIndex * singleH, nowTime);
				return;
			}
			resetInteger();
		};

		on(el, ['touchstart', 'mousedown'], touchstart);
		on(el, ['touchmove', 'mousemove'], touchmove);
		on(el, ['touchend', 'mouseup'], touchend);
		on(scroller, ['webkitTransitionEnd', 'transitionend'], transitionEnd);

		el._translate = translate;
		el._length = length;
		el._singleH = singleH;

		return el;
	};

	var number = function(min, max) {
		var _array = [];
		do {
			_array.push(min++);
		} while (min <= max);
		return _array;
	};

	var data = {
		date: [{
			name: '年',
			list: number(new Date().getFullYear() - 10, new Date().getFullYear() + 10)
		}, {
			name: '月',
			list: number(1, 12)
		}, {
			name: '日',
			list: number(1, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())
		}],
		time: [{
			name: '时',
			list: number(0, 23)
		}, {
			name: '分',
			list: number(0, 59)
		}]
	};

	var urls = [];

	var mSelect = function(opts) {
		opts = opts || {};
		this.mode = opts.mode || '';
		this.data = opts.data || this.mode !== '' && data[this.mode];
		if (!this.data.length) return;
		this.length = this.data.length;
		this.align = opts.align || '';
		this.title = opts.title || '';

		this.cssUrl = opts.cssUrl || 'mSelect.css';
		if (urls.indexOf(this.cssUrl) < 0) {
			urls.push(this.cssUrl);
			// 加载对应css文件
			loadCSS(this.cssUrl);
		}

		this.parent = opts.parent || document.body;
		this.boxClass = opts.boxClass || 'mSelect-box';
		this.containerClass = opts.containerClass || 'mSelect-container';
		
		this.headClass = opts.headClass || 'mSelect-head';

		this.contentClass = opts.contentClass || 'mSelect-content';
		this.wrapperClass = opts.wrapperClass || 'mSelect-wrapper';
		this.scrollerClass = opts.scrollerClass || 'mSelect-scroller';
		this.suffixClass = opts.suffixClass || 'mSelect-suffix';
		this.maskClass = opts.maskClass || 'mSelect-mask';
		
		this.footClass = opts.footClass || 'mSelect-foot';		
		this.defineClass = opts.defineClass || 'mSelect-define';
		this.cancelClass = opts.cancelClass || 'mSelect-cancel';

		this.select = opts.select || function() {};
		if (typeof opts === 'function') this.select = opts;

		this.items = [];
		this.els = [];
	};
	mSelect.prototype = {
		_initCreate: function() {
			var _this = this;
			var create = function(item) {
				var name = item['name'] || '';
				var list = item['list'] || [];
				var wrapper = document.createElement('div');
				var scroller = document.createElement('ul');
				var suffix = document.createElement('div');
				var mask = document.createElement('div');
				var html = '<li></li>';
				var i = 0;
				var n = list.length;
				wrapper.className = _this.wrapperClass;
				scroller.className = _this.scrollerClass;
				suffix.className = _this.suffixClass;
				mask.className = _this.maskClass;
				for (; i < n; i++) {
					html += (name !== '' ? '<li>' : '<li style="text-align:center">') + list[i] + '</li>';
				}
				html += '<li></li>';
				scroller.innerHTML = html;
				wrapper.appendChild(scroller);
				if (name !== '') {
					suffix.innerHTML = name;
					wrapper.appendChild(suffix);
				} else {
					scroller.style.width = '100%';
				}
				wrapper.appendChild(mask);
				return wrapper;
			};
			var viewW = document.documentElement.clientWidth;
			var viewH = document.documentElement.clientHeight;
			var container = document.createElement('div');
			var head = document.createElement('div');
			var content = document.createElement('div');
			var foot = document.createElement('div');

			this.box = document.createElement('div');
			this.box.className = this.boxClass;
			this.box.style.width = viewW + 'px';
			this.box.style.height = viewH + 'px';

			container.className = this.containerClass;
			if (this.title !== '') {
				head.className = this.headClass;
				head.innerHTML = this.title;
				container.appendChild(head);
			}			

			content.className = this.contentClass;
			for (var i = 0, item = null; i < this.length; i++) {
				item = create(this.data[i]);
				content.appendChild(item);
				this.items.push(item);
			}
			container.appendChild(content);

			foot.className = this.footClass;
			this.defineBtn = document.createElement('div');
			this.defineBtn.className = this.defineClass;
			this.defineBtn.innerHTML = '确定';
			this.cancelBtn = document.createElement('div');
			this.cancelBtn.className = this.cancelClass;
			this.cancelBtn.innerHTML = '取消';
			foot.appendChild(this.defineBtn);
			foot.appendChild(this.cancelBtn);
			container.appendChild(foot);

			this.box.appendChild(container);
			this.parent.appendChild(this.box);
		},
		_bindScroll: function() {
			for (var i = 0; i < this.length; i++) {
				this.els.push(mScroll(this.items[i]));
			}
		},
		_resetPosition: function() {
			if (this.align !== '') return this._setAlign();
			if (this.mode === 'date') {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var date = now.getDate();

				var indexY = this.data[0].list.indexOf(year);
				var indexM = this.data[1].list.indexOf(month);
				var indexD = this.data[2].list.indexOf(date);

				var wy = this.els[0];
				wy._index = indexY;
				wy._translate((-indexY) * wy._singleH);

				var wm = this.els[1];
				wm._index = indexM;
				wm._translate((-indexM) * wm._singleH);

				var wd = this.els[2];
				wd._index = indexD;
				wd._translate((-indexD) * wd._singleH);
			} else if (this.mode === 'time') {
				var now = new Date();
				var hour = now.getHours();
				var minute = now.getMinutes();

				var indexH = this.data[0].list.indexOf(hour);
				var indexM = this.data[1].list.indexOf(minute);

				var wh = this.els[0];
				wh._index = indexH;
				wh._translate((-indexH) * wh._singleH);

				var wm = this.els[1];
				wm._index = indexM;
				wm._translate((-indexM) * wm._singleH);
			}
		},
		_setAlign: function() {
			if (this.align === 'center') {
				for (var i = 0; i < this.length; i++) {
					var w = this.els[i];
					var x = 2 - Math.ceil(w._length / 2);
					w._index = Math.abs(x);
					w._translate(x * w._singleH);
				}
			} else if (this.align === 'bottom') {
				for (var i = 0; i < this.length; i++) {
					var w = this.els[i];
					var x = 3 - w._length;
					w._index = Math.abs(x);
					w._translate(x * w._singleH);
				}
			}
		},
		_initEvent: function() {
			on(this.defineBtn, 'click', function() {
				var _array = [];
				for (var i = 0; i < this.length; i++) {
					_array.push(this.data[i].list[this.els[i]._index]);
				}
				this.hide();
				this.select && this.select(_array);
			}.bind(this));
			on(this.cancelBtn, 'click', function() {
				this.hide();
			}.bind(this));
			on(this.box, 'touchmove', function(e) {
				e.preventDefault();
			});
		},
		_setup: function() {
			this._initCreate();
			this._bindScroll();
			this._resetPosition();
			this._initEvent();
		},
		show: function() {
			if (!this.box) this._setup();
			this.box.style.display = 'block';
		},
		hide: function() {
			this.box.style.display = 'none';
		}
	};

	mSelect.number = number;
	return mSelect;
});