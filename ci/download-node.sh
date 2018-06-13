#!/usr/bin/env bash

SOURCE="https://github.com/emotiq/emotiq/releases/download/test-0.14-websockets/"
FILE_NAME_LINUX="emotiq-20180604110340-c100034-linux"
FILE_NAME_MACOS="emotiq-20180604040339-c100034-macos"

download_node_linux()
{
(cd /tmp && \
    curl -L $SOURCE$FILE_NAME_LINUX.tar.bz2 | tar xvjf -
    cd -
    cp /tmp/$FILE_NAME_LINUX/emotiq .
  )
}

download_node_macos()
{
(cd /tmp && \
    curl -L $SOURCE$FILE_NAME_MACOS.tar.bz2 | tar xvjf -
    cd -
    cp /tmp/$FILE_NAME_MACOS/emotiq .
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