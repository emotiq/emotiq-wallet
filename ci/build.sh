#!/usr/bin/env bash

TARBALL=emotiq-wallet-0.1.0.tar.gz

yarn install
yarn dist

ls -l release/emotiq*gz
case $(uname -a) in
  Linux*)
    md5sum release/${TARBALL}
    ;;
  Darwin*)
    md5 release/${TARBALL}
    ;;
  *)
    echo Only Linux and macOS are supported at this moment
    ;;
esac
