# angular-zxcvbn [![Build Status](https://travis-ci.org/jamesclark92/angular-zxcvbn.svg?branch=master)](https://travis-ci.org/jamesclark92/angular-zxcvbn)


This is a simple directive for the [`zxcvbn`](https://github.com/dropbox/zxcvbn) library.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
 * [Directive](#directive) 
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

### Directive

The main way to use the directive is as an input attribute with the `ng-model` attribute:
```html
 <input type='password' ng-model='userPassword' zxcvbn>
```
This will set `$scope.zxcvbn` to the result of calling the zxcvbn function on `$scope.userPassword`.
This object will take the form specified [here](https://github.com/dropbox/zxcvbn#usage) as specified by the zxcvbn documentation.
*The most relative property is `$scope.zxcvbn.score` - which is a integer ranging from 0 to 4. With 4 being the strongest password and 0 being the weakest.*


#### Extras

The attribute can also be passed an "extras" value. Extras are other bits of information affecting the strength of the password, such as username, email address, date of birth. 

Example of how you might use this directive within a registration form:
```html
<form name="myForm">
  <input type="email" ng-model="email" name="emailAddress">
  <input type="text" ng-model="username" name="username">
  <input type="password" ng-model="password" name="password" zxcvbn="myForm">
  <input type="password" ng-model="confirmPassword" name="confirmPassword">
</form>
```
* Here you can see we give the 3rd input element the attribute
* We pass it the value `myForm`, which is the name of the form element. *The directive then picks up the associated scope property.
* `angular-zxcvbn` will look at all named fields in the form for you (**ignoring fields with 'password' in their name**) and pass them on to the zxcvbn call.

**Note:** if you do not wish to pass in a form object, you can also pass a scope variable that is an array of strings.


#### Minimum Score

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

There's another input variable available called `extra` where you can put an array with other strings the user has inputted like name, username or email, that way `zxcvbn` gets a better time to crack estimate.

If you don't want it to display the value, just pass  `ng-show="false"`

If you want to get the full Object response from `zxcvbn` then pass a variable to the attribute `full` and it will return there the full data from `zxcvbn`.

If in doubt on how to implement, please check the example available at `example/index.html` or try it live on <http://plnkr.co/9wTZgR>.


## History ##

Refer to the [History.md](History.md) file.

## Author ##

© 2014, Jose Luis Rivas `<me@ghostbar.co>`.

## Contributors ##

James Clark <james.clark92@hotmail.co.uk>

## License ##

The files are licensed under the MIT terms.
