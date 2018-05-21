#!/usr/bin/env bash

install_deps_linux()
{
  apt-get update && apt-get install -yqq \
    autoconf \
    automake \
    build-essential \
    libc6 \
    libconfig++9v5 \
    libgcc1 \
    libncurses5 \
    libstdc++6 \
    libz1 \
    libssl-dev \
    libcrypto++-dev
}

case $(uname -s) in
    Linux*)
      install_deps_linux
      ;;
    *)
      echo Only Linux supported atm.
esac
