#!/bin/bash

BUILD_IMGS=all

if [ "$1" ]; then
  BUILD_IMGS=$1
fi


BUILD_ARGS=""
if [ "$2" ]; then
  BUILD_ARGS="${@:2}"
fi


if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "app" ]; then
  echo "Building App Docker Iamge ..."
  echo ""
  yarn doc build --context app "$BUILD_ARGS"
  echo ""
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "backend" ] || [ "$BUILD_IMGS" == "be" ]; then
  echo ""
  echo "Building Backend Docker Iamge ..."
  echo ""
  yarn doc build --context backend "$BUILD_ARGS"
  echo ""
fi

# if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "frontend" ] || [ "$BUILD_IMGS" == "fe" ]; then
#   echo ""
#   echo "Building Frontend Docker Iamge ..."
#   echo ""
#   yarn doc build --context frontend "$BUILD_ARGS"
# fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "conductor" ] || [ "$BUILD_IMGS" == "cd" ]; then
  echo "Building Conductor Docker Iamge ..."
  echo ""
  yarn doc build --context conductor "$BUILD_ARGS"
  echo ""
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "screencast" ] || [ "$BUILD_IMGS" == "sc" ]; then
  echo "Building Screencast Docker Iamge ..."
  echo ""
  yarn doc build --context screencast "$BUILD_ARGS"
  echo ""
fi

echo "Finished building and pushing docker images"
echo ""