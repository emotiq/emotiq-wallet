# Usage hints 


* Clone and prepare project
```bash
git clone <repo url>
cd emotiq-wallet
yarn
```

* Run in dev mode

```download node
./ci/download-node.sh
```

```bash
yarn dev
``` 

* Build distr 

(currently builds `tar.gz` with linux distribution)

```bash
yarn dist
```

# Build requirements:

* Yarn 1.6.0
* Node 8.9.4

## Realm

Realm-js needs to rebuild binaries for electron. Requirements:

* Linux 
  * autoconf
  * automake
  * libc6
  * libconfig++9v5
  * libgcc1
  * libncurses5
  * libstdc++6
  * libz1
  * libssl-dev (libssl.a)
  * libcrypto++-dev (libcryptopp.a)
