#!/usr/bin/env bash

yarn install
yarn dist

ls -l release/emotiq*gz
case $(uname -a) in
  Linux*)
    md5sum release/emotiq-wallet-0.1.0.tar.gz
    ;;
  *)
    echo Only Linux supported at this moment
esac
