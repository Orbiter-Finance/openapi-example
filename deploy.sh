#!/bin/sh

function frontendDeploy {
  echo "------------frontend begin deploy------------"
  docker stop frontend && docker rmi frontend
  docker build . -t frontend && docker run --rm -d --name frontend --link backend:backend -p 8001:80 frontend
  echo "------------frontend deploy finish------------"
}

frontendDeploy

