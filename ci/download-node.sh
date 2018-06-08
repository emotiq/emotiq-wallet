#!/usr/bin/env bash

(cd /tmp && \
    curl -L https://github.com/emotiq/emotiq/releases/download/test-0.13-websockets/emotiq-20180530121043-3c0e04e-linux.tar.bz2 | tar xvjf -
    cd -
    mkdir -p src/app/main/lisp
    cp /tmp/emotiq-20180530121043-3c0e04e-linux/emotiq src/app/main/lisp/
  )