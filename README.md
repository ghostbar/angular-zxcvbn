# angular-zxcvbn [![Build Status](https://travis-ci.org/jamesclark92/angular-zxcvbn.svg?branch=master)](https://travis-ci.org/jamesclark92/angular-zxcvbn)

This is a simple directive for the [`zxcvbn`](https://github.com/dropbox/zxcvbn) library.


## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
 * [Attribute](#attribute) 
 * [Element](#element)
* [History](#history)
* [Author](#author)
* [Contributors](#contributors)
* [License](#license)

## Installation

Install with bower:
```bash
bower install zxcvbn angular-zxcvbn --save
```

Include the following javascript source files:
```html
<script src='/bower_components/zxcvbn/dist/zxcvbn.js'></script>
<script src='/bower_components/angular-zxcvbn/angular-zxcvbn.js'></script>
```

Add `zxcvbn` as an angular dependency. E.G. If your module is called `myApp` then you would do:
```javascript
angular.module('myApp', ['zxcvbn']);
  ```

## Usage

### Attribute

The main way to use the directive is as an attribute alongside the `ng-model` attribute:
```html
 <input type='password' ng-model='userPassword' zxcvbn>
```
This will set `$scope.zxcvbn` to the [result](https://github.com/dropbox/zxcvbn#usage) of calling the zxcvbn function on `$scope.userPassword`.


#### Attribute Values

The attribute can also be passed an "extras" value. Extras are other bits of information affecting the strength of the password, such as username, email address, date of birth. 

Example:
```html
<form name="myForm">
  <input type="email" ng-model="email" name="emailAddress">
  <input type="text" ng-model="username" name="username">
  <input type="password" ng-model="password" name="password" zxcvbn="myForm">
  <input type="password" ng-model="confirmPassword" name="confirmPassword">
</form>
```
* Here you can see we give the 3rd input element the attribute
* We pass it the value `myForm`, which is the value of the `name` attribute of the parent form element - this allows the directive to access the associated scope property.*
* `angular-zxcvbn` will look at all elements with the `name` attribute in the form, *ignoring fields with 'password' in their name*, and pass them on to the zxcvbn call.

**Note:** if you do not wish to pass in a form object, you can also pass a scope variable that is an array of strings.


#### Form Validation

If you have passed in a form object as the extras value, then you may also want to have the password field marked as invalid when below a certain score. This can be done in 2 ways:
```html
<input type="password" ng-model="password" name="password" zxcvbn="myForm" zxcvbn-min-score="2"> // hard code the value
<input type="password" ng-model="password" name="password" zxcvbn="myForm" zxcvbn-min-score="minScore"> // pass it a scope variable
```


### Element

You can use the directive as an element. The element takes 3 attributes:
* `password`<sub>**required**</sub> - the password that you want to be tested (scope variable).
* `extras`<sub>*optional*</sub> - an array of strings that zxcvbn will use to get a better "crack time" estimate. *Here you would normally have other form fields such as name, email address, username...*
* `data`<sub>*optional*</sub> - a scope object that will contain the [returned data](https://github.com/dropbox/zxcvbn#usage) from the zxcvbn call.

```html
<zxcvbn password='passwordVar' extras='extrasArray' data='zxcvbnData'></zxcvbn>
```


## History ##

Refer to the [History.md](History.md) file.

## Author ##

© 2014, Jose Luis Rivas `<me@ghostbar.co>`.

## Contributors ##

James Clark <james.clark92@hotmail.co.uk>

## License ##

The files are licensed under the MIT terms.
