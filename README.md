# angular-zxcvbn [![Build Status](https://travis-ci.org/jamesclark92/angular-zxcvbn.svg?branch=master)](https://travis-ci.org/jamesclark92/angular-zxcvbn)


This is a simple directive for the [`zxcvbn`](https://github.com/dropbox/zxcvbn) library.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
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
