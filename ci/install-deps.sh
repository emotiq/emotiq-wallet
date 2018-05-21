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

install_deps_macos()
{
  (cd /tmp && \
    curl -L https://nodejs.org/dist/v8.11.2/node-v8.11.2-darwin-x64.tar.gz | tar xvfz - && \
    mv node-v8.11.2-darwin-x64/{bin,include,lib,share} /usr/local
  )
  brew install yarn --without-node
}

case $(uname -s) in
    Linux*)
      install_deps_linux
      ;;
    Darwin*)
      install_deps_macos
    *)
      echo Only Linux and macOS are supported atm.
esac
