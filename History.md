2.0.0 / 2014-06-25 
==================

 * `show` flag for not showing data in template
 * using phantomjs
 * assign full data to a given variable
 * renaming module to `zxcvbn`

2.1.0 / 2015-12-22
==================

 * Updated to zxcvbn 4.2.0
 * Removed `show` flag - use `ng-show="false"` instead
 * Allow calling of zxcvbn library on empty strings
 * Refactored tests
 
 
3.0.0 / 2015-12-30
==================
 
* Added functionality for use as attribute
  * Use `zxcvbn` as an attribute alongside the `ng-model` attribute
  * Can pass a form object and have extra fields added as a parameter automatically
  * Can have the form marked as invalid using the `zxcvbn-min-score` attribute.
* Renamed variables in element directive
* Added gulp file for building - just run default gulp task.


3.1.0 / 2015-24-01
==================
 
* Refactored code to allow for "controller as" syntax