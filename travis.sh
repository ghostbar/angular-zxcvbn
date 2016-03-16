#!/bin/bash

set -e

if [ $TEST = "unit-tests" ]; then

  echo "Running unit-tests"
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  sleep 1
  gulp test
  CODECLIMATE_REPO_TOKEN=6ba4238a4867ac84b253a1f39cedc9ea9f04197e26d4597c92ed1f87ab0331eb codeclimate-test-reporter < coverage/lcov.info

elif [[ $TEST = "browser-tests" ]]; then

  echo "Running browser-tests"
  gulp test-saucelabs

fi
