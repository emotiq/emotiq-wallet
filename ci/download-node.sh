#!/usr/bin/env bash

SOURCE="https://github.com/emotiq/emotiq/releases/download/mvp-0.1.2/"
FILE_NAME_LINUX="emotiq-20180802110735-1138e3c-linux"
FILE_NAME_MACOS="emotiq-20180802040702-1138e3c1-macos"

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