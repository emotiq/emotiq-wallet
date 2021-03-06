#!/usr/bin/env bash

SOURCE="https://github.com/emotiq/emotiq/releases/download/test-0.15-websockets/"
FILE_NAME_LINUX="emotiq-20180614122230-b5a8beb-linux"
FILE_NAME_MACOS="emotiq-20180614052219-b5a8beb-macos"

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