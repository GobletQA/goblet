#!/bin/bash

BUILD_IMGS=all

if [ "$1" ]; then
  BUILD_IMGS=$1
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "app" ]; then
  echo "Building Base Docker Iamge ..."
  echo ""
  yarn doc build --no-push
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "backend" ] || [ "$BUILD_IMGS" == "be" ]; then
  echo ""
  echo "Building Backend Docker Iamge ..."
  echo ""
  yarn doc build --context backend --no-push
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "frontend" ] || [ "$BUILD_IMGS" == "fe" ]; then
  echo ""
  echo "Building Frontend Docker Iamge ..."
  echo ""
  yarn doc build --context frontend --no-push
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "conductor" ] || [ "$BUILD_IMGS" == "cd" ]; then
  echo "Building Proxy Docker Iamge ..."
  echo ""
  yarn doc build --context conductor --no-push
fi

if [ "$BUILD_IMGS" == "all" ] || [ "$BUILD_IMGS" == "screencast" ] || [ "$BUILD_IMGS" == "sc" ]; then
  echo "Building Proxy Docker Iamge ..."
  echo ""
  yarn doc build --context screencast --no-push
fi

echo ""
echo "Finished building and pushing docker images"