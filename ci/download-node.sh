#!/usr/bin/env bash

SOURCE="https://github.com/emotiq/emotiq/releases/download/mvp-0.2.0/"
FILE_NAME_LINUX="emotiq-20180806142706-d7c805e-linux"
FILE_NAME_MACOS="emotiq-20180806072653-d7c805e0-macos"

download_node_linux()
{
(cd /tmp && \
    curl -L $SOURCE$FILE_NAME_LINUX.tar.bz2 | tar xvjf -
    cd -
    cp -a /tmp/$FILE_NAME_LINUX/. .
  )
}

download_node_macos()
{
(cd /tmp && \
    curl -L $SOURCE$FILE_NAME_MACOS.tar.bz2 | tar xvjf -
    cd -
    cp -a /tmp/$FILE_NAME_MACOS/. .
  )
}

case $(uname -s) in
    Linux*)
      download_node_linux
      ;;
    Darwin*)
      download_node_macos
      ;;
    *)
      echo Only Linux and macOS are supported atm.
esac