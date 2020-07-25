#!/usr/bin/env bash

docker build -t cuppa-bash .

# ports for node inspect
# run from root project folder
# power shell ${PWD}

cd ../.. && docker run -it --name cuppa-bash -v `pwd`:/app -w /app --network cuppa-network cuppa-bash bash

docker start -i cuppa-bash
