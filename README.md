angular-zxcvbn [![Build Status](https://travis-ci.org/jamesclark92/angular-zxcvbn.svg?branch=master)](https://travis-ci.org/jamesclark92/angular-zxcvbn)
==============

This is a simple directive for the [`zxcvbn`](https://github.com/dropbox/zxcvbn) library.

Usage
-----

Install with bower:

    bower install zxcvbn angular-zxcvbn --save

Add to your HTML files:

    <script src='/bower_components/zxcvbn/dist/zxcvbn.js'></script>
    <script src='/bower_components/angular-zxcvbn/angular-zxcvbn.js'></script>

    angular.module('myApp', ['zxcvbn']);

Ready to use in your views!:

`index.html:`

    Time to crack your password <zxcvbn password='passwordVar'></zxcvbn>

There's another input variable available called `extra` where you can put an array with other strings the user has inputted like name, username or email, that way `zxcvbn` gets a better time to crack estimate.

If you don't want it to display the value, just pass  `ng-show="false"`

If you want to get the full Object response from `zxcvbn` then pass a variable to the attribute `full` and it will return there the full data from `zxcvbn`.

If in doubt on how to implement, please check the example available at `example/index.html` or try it live on <http://plnkr.co/9wTZgR>.

History
-------
Refer to the History.md file.

Author
------
© 2014, Jose Luis Rivas `<me@ghostbar.co>`.

Contributors
------------
James Clark <james.clark92@hotmail.co.uk>

License
-------
The files are licensed under the MIT terms.
