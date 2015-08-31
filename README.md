# Systemantics infinite scrolling datepicker

## Description

Why a new datepicker if there is the jQuery UI datepicker that’s heavily used everywhere?
The answer is simple: Because it’s infinitely scrolling.

Most (if not all) datepickers resemble traditional paper calendars with one month on view
at a time. In a digital setting with virtually endless viewports, this is an unnecessary limitation.

## Usage

Using the datepicker is easy:

	$('.datepicker-input').datepicker();

The datepicker binds to the `change`, `keyup`, `keydown`, `mouseenter`, `mouseleave` and `focus`
events of the selected elements. Also, it sets the value of the selected elements using jQuery’s `.val()` method,
and listens to changes of the elements’ value. This makes the datepicker ideal to bind to `input[type="text"]`
elements, even though you can bind the datepicker to any other element.

### Show and hide datepicker

Once bound, you can programmatically show and hide the datepicker like so:

	$('.datepicker-input').datepicker('show');
	$('.datepicker-input').datepicker('hide');

Keep in mind that the datepicker is shown automatically when the bound element gains focus
and hidden when the focus is lost.

### Event callback

The datepicker calls the `onFocus` method when a date gets picked:

	$('.datepicker-input').datepicker({
		onSelect: function (date) {
			// ...
		}
	});

### Setting the default date

By default, the datepicker opens on the current date (“today”). Setting an individual
default date is possible:

	$('.datepicker-input').datepicker({
		defaultDate: '2015-08-31'
	});

### Internationalization / localization

The datepicker UI can be localized using the following settings:

	$('.datepicker-input').datepicker({
		monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
		dayNamesMin: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
		firstDay: 0,
		prevYearText: '&lt;&lt;',
		prevText: '&lt;',
		todayText: 'today',
		nextText: '&gt;',
		nextYearText: '&gt;&gt;'
	});

### Display date

By default, our datepicker works with dates in the <a href="https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates">ISO 8601 format</a> YYYY-MM-DD. These have a couple of advantages,
like allowing an alphabetical sorting of date strings. If ISO formatted dates are sometimes not desired as
display format in the input field the datepicker is attached to. Instead of providing display formats, our datepicker
provides two callbacks to convert from the ISO date format to the display date format and back. That way, you can
support any desired display date format and don’t have to rely on the available pre-implemented conversions.

	$('.datepicker-input').datepicker({
		convertISOToDisplayDate: function (isoDate) {
			return ...;
		},
		convertDisplayDateToISO: function (displayDate) {
			return ...;
		}
	});

## License

This plugin is distributed under the terms of the MIT license.

Copyright &copy; 2015 [Systemantics GmbH](http://www.systemantics.net/)

## Changelog

### v0.10:

- Initial release.
