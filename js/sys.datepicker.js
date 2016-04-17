/*
 * Systemantics infinite scrolling datepicker
 * v0.12.2
 *
 * Copyright (C) 2015–2016 by Systemantics GmbH
 *
 * hello@systemantics.net
 * http://www.systemantics.net/
 *
 * Licensed under the MIT license.
 */

(function ($) {
	var numYears = 5;

	function formatDate(year, month, day) {
		return ('0000' + year).substr(-4) + '-' + ('00' + month).substr(-2) + '-' + ('00' + day).substr(-2);
	}

	function getMonthHtml(year, month, settings) {
		var monthHtml = '<div class="sys-datepicker-month" data-year="' + year + '" data-month="' + month + '"><div class="sys-datepicker-month-header">' + settings.monthNames[month - 1] + ' ' + year + '</div>';

		var monthsFirstDayOfWeek = (new Date(formatDate(year, month, 1))).getUTCDay(),
			daysPerMonth = month == 4 || month == 6 || month == 9 || month == 11 ? 30
				: (month == 2 ? (year & 3 || !(year % 25) && year & 15 ? 28 : 29) : 31);

		for (var i = 0; i < (monthsFirstDayOfWeek + 7 - settings.firstDay)%7; i++) {
			monthHtml = monthHtml + '<div class="sys-datepicker-placeholder"/>';
		}
		var today = getTodayISO(),
			dow = monthsFirstDayOfWeek;
		for (var d = 1; d <= daysPerMonth; d++) {
			var classes = [ 'sys-datepicker-day' ],
				thisDate = formatDate(year, month, d);
			if (thisDate == today) {
				classes.push('sys-datepicker-day-today');
			}
			if (dow == 0 || dow == 6) {
				classes.push('sys-datepicker-day-weekend');
			}
			monthHtml = monthHtml + '<div class="' + classes.join(' ') + '" data-date="' + thisDate + '">' + d + '</div>';

			// Increase date of the week
			dow = dow + 1;
			if (dow == 7) {
				dow = 0;
			}
		}

		monthHtml = monthHtml + '</div>';

		return monthHtml;
	}

	function getYearHtml(year, settings) {
		var yearHtml = '<div class="sys-datepicker-year" data-year="' + year + '">';

		for (var m = 1; m <= 12; m++) {
			yearHtml = yearHtml + getMonthHtml(year, m, settings);
		}

		yearHtml = yearHtml + '</div>';

		return yearHtml;
	}

	function addYear(dp, year, settings) {
		var dpBody = dp.find('.sys-datepicker-body');
		var bottomYear = $('.sys-datepicker-year:eq(-1)').data('year');

		if (year > bottomYear) {
			// Append one at the bottom
			dpBody.append(getYearHtml(year, settings));
			// Remove one at the top while maintaining the scroll position
			var scrollTop = dpBody.scrollTop();
			dp.find('.sys-datepicker-year:eq(0)').remove();
			dpBody.scrollTop(scrollTop - dp.find('.sys-datepicker-year:eq(0)').outerHeight(true));
		} else {
			// Append year at the top while maintaining scroll position
			var scrollTop = dpBody.scrollTop();
			dpBody.prepend(getYearHtml(year, settings));
			dpBody.scrollTop(scrollTop + dp.find('.sys-datepicker-year:eq(0)').outerHeight(true));
			// Remove one at the bottom
			dp.find('.sys-datepicker-year:eq(-1)').remove();
		}
	}

	function populate(dp, settings) {
		var dpBody = dp.find('.sys-datepicker-body'),
			startYear = parseInt(settings.defaultDate);

		// Add years
		for (var y = startYear - (numYears - 1) / 2; y <= startYear + (numYears - 1) / 2; y++) {
			dpBody.append(getYearHtml(y, settings));
		}
	}

	function gotoYearMonth(dp, year, month, settings) {
		var dpBody = dp.find('.sys-datepicker-body');
		var selector = '.sys-datepicker-month[data-year="' + year + '"]';

		if (month >= 1 && month <= 12) {
			selector = selector + '[data-month="' + month + '"]';
		}

		var monthEl = dp.find(selector);
		if (monthEl.length == 0) {
			// Append year
			addYear(dp, year, settings);
			monthEl = dp.find(selector)
		}

		// Remove all other years
		dp.find('.sys-datepicker-year:not([data-year="' + year + '"])').remove();
		// Add the years before ...
		for (var y = year - 1; y >= year - (numYears - 1) / 2; y--) {
			dpBody.prepend(getYearHtml(y, settings));
		}
		// ... and after
		for (var y = year + 1; y <= year + (numYears - 1) / 2; y++) {
			dpBody.append(getYearHtml(y, settings));
		}

		// Scroll to that year and month
		dpBody.scrollTop(dpBody.scrollTop() + monthEl.position().top);
		// dpBody.animate({scrollTop: dpBody.scrollTop() + monthEl.position().top}, 250);
	}

	function getCurrent(dp) {
		var current;

		dp.find('.sys-datepicker-month').each(function () {
			var monthEl = $(this);

			if (monthEl.position().top + monthEl.outerHeight(true) / 2 > 0) {
				current = {
					year: monthEl.data('year'),
					month: monthEl.data('month')
				};
				return false;
			}
		});

		return current;
	}

	function getTodayISO() {
		var today = new Date();

		return formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
	}

	function isValidISODate(date) {
		return date.match(/^\d{4}-\d{2}-\d{2}/) == true;
	}

	$.fn.datepicker = function (options, value) {
		if (options == 'show') {
			this.trigger('show.sys-datepicker');

		} else if (options == 'hide') {
			this.trigger('hide.sys-datepicker');

		} else if (options == 'addDates') {
			this.trigger('addDates.sys-datepicker', [value]);

		} else if (options == 'removeDates') {
			this.trigger('removeDates.sys-datepicker', [value]);

		} else {
			var settings = $.extend({
				onSelect: null,
				defaultDate: getTodayISO(),
				monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
				dayNamesMin: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
				firstDay: 0,
				prevYearText: '&lt;&lt;',
				prevText: '&lt;',
				currentText: 'Today',
				nextText: '&gt;',
				nextYearText: '&gt;&gt;',
				convertISOToDisplayDate: false,
				convertDisplayDateToISO: false
			}, options);

			this.each(function () {
				var el = $(this);

				if (el.hasClass('sys-datepicker-attached')) {
					// Don’t init twice
					return;
				}

				el.addClass('sys-datepicker-attached');

				if (!isValidISODate(settings.defaultDate)) {
					settings.defaultDate = getTodayISO();
				}

				var dp = $('<div class="sys-datepicker" style="display:none"/>').appendTo('body'),
					dpContent = $('<div class="sys-datepicker-content"/>').appendTo(dp),
					// Note on the spaces between elements in the next line: this is required for text-align:justify to work
					// See http://stackoverflow.com/questions/12822068/dom-equidistant-divs-with-inline-blocks-and-text-justify-wont-work-when-inserti#12822407
					dpHeader = $('<div class="sys-datepicker-header"><div class="sys-datepicker-buttons"><div class="sys-datepicker-button sys-datepicker-button-prevyear">' + settings.prevYearText + '</div> <div class="sys-datepicker-button sys-datepicker-button-prevmonth">' + settings.prevText + '</div> <div class="sys-datepicker-button sys-datepicker-button-today">' + settings.currentText + '</div> <div class="sys-datepicker-button sys-datepicker-button-nextmonth">' + settings.nextText + '</div> <div class="sys-datepicker-button sys-datepicker-button-nextyear">' + settings.nextYearText + '</div></div></div>').appendTo(dpContent),
					dpBody = $('<div class="sys-datepicker-body"/>').appendTo(dpContent),
					selectedDates = [],
					inputDate = '';

				var dpDayHeaders = $('<div class="sys-datepicker-days"/>').appendTo(dpHeader);
				for (var i = settings.firstDay; i <= settings.firstDay + 6; i++) {
					var dayHeaderHtml = '<div class="sys-datepicker-days-dow',
						dow = i % 7;
					if (dow == 0 || dow == 6) {
						dayHeaderHtml = dayHeaderHtml + ' sys-datepicker-day-weekend';
					}
					$(dayHeaderHtml + '">' + (decodeURIComponent(escape(settings.dayNamesMin[dow])) + '</div>')).appendTo(dpDayHeaders);
				}

				populate(dp, settings);
				dp.show();
				gotoYearMonth(dp, parseInt(settings.defaultDate), parseInt(settings.defaultDate.substr(5, 2)), settings);
				dp.hide();

				var prevScrollTop = dpBody.scrollTop();
				dpBody.on('scroll', function () {
					var scrollTop = dpBody.scrollTop();

					if (scrollTop > prevScrollTop) {
						direction = 1;
					} else if (scrollTop < prevScrollTop) {
						direction = -1;
					} else {
						direction = 0;
					}
					prevScrollTop = scrollTop;

					var current = getCurrent(dp);
					if (typeof current != "undefined") {
						var topYear = dpBody.find('.sys-datepicker-year:eq(0)').data('year'),
							bottomYear = dpBody.find('.sys-datepicker-year:eq(-1)').data('year');

						if (current.year == bottomYear) {
							addYear(dp, bottomYear + 1, settings);
						} else if (current.year == topYear) {
							addYear(dp, topYear - 1, settings);
							prevScrollTop = dpBody.scrollTop();
						}
					}
				});

				var prevVal = null;
				el.on('keyup change', function () {
					var val = $(this).val(),
						comp,
						year,
						month;

					if ($.isFunction(settings.convertDisplayDateToISO)) {
						val = settings.convertDisplayDateToISO(val);
						if (typeof val !== 'string' && !(val instanceof String)) {
							return;
						}
					}

					comp = val.trim().match(/^(\d{4})(-((\d{2})(-(\d{2})?)?)?)?$/);

					if (!!comp && !!comp[1]) {
						year = parseInt(comp[1]);
						month = !!comp[3] ? Math.max(1, Math.min(12, parseInt(comp[3]))) : 1;
						gotoYearMonth(dp, year, month, settings);
						setInputDate(val.trim());
					}
				});

				dp.on('mouseenter', '.sys-datepicker-day,.sys-datepicker-button', function () {
					$(this).addClass('sys-datepicker-hover');
				});
				dp.on('mouseleave', '.sys-datepicker-day,.sys-datepicker-button', function () {
					$(this).removeClass('sys-datepicker-hover');
				});

				dp.on('click', '.sys-datepicker-day', function () {
					var date = $(this).data("date");

					if ($.isFunction(settings.convertISOToDisplayDate)) {
						date = settings.convertISOToDisplayDate(date);
					}

					// Set value
					el.val(date);
					el.focus();

					// Callback
					if ($.isFunction(settings.onSelect)) {
						settings.onSelect.call(el.eq(0), date);
					}
				});

				dp.on('click', '.sys-datepicker-button-prevmonth', function () {
					var current = getCurrent(dp);

					current.month = current.month - 1;
					if (current.month == 0) {
						current.year = current.year - 1;
						current.month = 12;
					}
					gotoYearMonth(dp, current.year, current.month, settings);
				});

				dp.on('click', '.sys-datepicker-button-nextmonth', function () {
					var current = getCurrent(dp);

					current.month = current.month + 1;
					if (current.month == 13) {
						current.year = current.year + 1;
						current.month = 1;
					}
					gotoYearMonth(dp, current.year, current.month, settings);
					el.focus();
				});

				dp.on('click', '.sys-datepicker-button-prevyear', function () {
					var current = getCurrent(dp);

					gotoYearMonth(dp, current.year - 1, current.month, settings);
					el.focus();
				});

				dp.on('click', '.sys-datepicker-button-nextyear', function () {
					var current = getCurrent(dp);

					gotoYearMonth(dp, current.year + 1, current.month, settings);
					el.focus();
				});

				dp.on('click', '.sys-datepicker-button-today', function () {
					var today = new Date();

					gotoYearMonth(dp, today.getFullYear(), today.getMonth() + 1, settings);
					el.focus();
				});

				el.on('focus click show.sys-datepicker', function () {
					var p = el.offset();

					setInputDate(el.val().trim());

					dp.css({
						position: 'absolute',
						left: p.left,
						top: p.top + el.outerHeight()
					});
					dp.show();
				});

				el.on('keydown', function (e) {
					if (e.keyCode == 9 || e.keyCode == 27) {
						// Hide on tab out and Esc
						dp.hide();
					}
				});

				$(document).on('click', function (e) {
					if ($(e.target).closest('.sys-datepicker').get(0) != dp.get(0) && $(e.target).closest('.sys-datepicker-attached').get(0) != el.get(0)) {
						dp.hide();
					}
				});

				el.on('hide.sys-datepicker', function () {
					dp.hide();
				});

				function addDate(date) {
					for (var i in selectedDates) {
						if (selectedDates[i] == date) {
							return;
						}
					}
					selectedDates.push(date);

					dp.find('.sys-datepicker-day[data-date="' + date + '"]').addClass('sys-datepicker-day-selected');
				}

				function removeDate(date) {
					var dates = [];

					for (var i in selectedDates) {
						if (selectedDates[i] != date) {
							dates.push(selectedDates[i]);
						}
					}
					selectedDates = dates;

					dp.find('.sys-datepicker-day[data-date="' + date + '"]').removeClass('sys-datepicker-day-selected');
				}

				function setInputDate(date) {
					dp.find('.sys-datepicker-day[data-date="' + inputDate + '"]').removeClass('sys-datepicker-day-input');
					var isSelected = false;
					for (var i in selectedDates) {
						if (selectedDates[i] == inputDate) {
							isSelected = true;
							break;
						}
					}
					if (!isSelected) {
						dp.find('.sys-datepicker-day[data-date="' + inputDate + '"]').removeClass('sys-datepicker-day-selected');
					}

					inputDate = date;
					dp.find('.sys-datepicker-day[data-date="' + inputDate + '"]').addClass('sys-datepicker-day-selected sys-datepicker-day-input');
				}

				el.on('addDates.sys-datepicker', function (e, dates) {
					if (Object.prototype.toString.call(dates) === '[object Array]') {
						for (var i in dates) {
							addDate(dates[i]);
						}
					} else {
						addDate(dates);
					}
				});

				el.on('removeDates.sys-datepicker', function (e, dates) {
					if (Object.prototype.toString.call(dates) === '[object Array]') {
						for (var i in dates) {
							removeDate(dates[i]);
						}
					} else {
						removeDate(dates);
					}
				});
			});
		}

		return this;
	};

})(jQuery);
