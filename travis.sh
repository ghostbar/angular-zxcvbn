#!/bin/bash

set -e

if [ $TEST = "unit-tests" ]; then

  echo "Running unit-tests"
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  sleep 1
  gulp test
  CODECLIMATE_REPO_TOKEN=5822a7769dbd5470b7dfd0a3fe43f06910dc2432fc880bfcebeda3eaca203809 codeclimate-test-reporter < coverage/lcov.info

elif [[ $TEST = "browser-tests" ]]; then

  echo "Running browser-tests"
  gulp test-saucelabs

fi
