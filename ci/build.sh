#!/usr/bin/env bash

TARBALL=emotiq-wallet-0.1.0.tar.gz

yarn install
yarn dist

ls -l release/*
