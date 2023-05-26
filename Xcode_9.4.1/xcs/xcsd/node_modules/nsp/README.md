command line tools
==================

> This package consists in a CLI tool that enables developers or CI tools to check if their Node.js projects are using packages with known and public vulnerable dependencies. The vulnerability database is provided by the [Node Security Project](https://nodesecurity.io)


## Badgers
[![NPM](https://nodei.co/npm/nsp.png?downloads=true&stars=true)](https://nodei.co/npm/nsp/)

[![Dependency Status](https://david-dm.org/nodesecurity/nsp.svg)](https://david-dm.org/nodesecurity/nsp)[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/nodesecurity/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

Through npm:
```bash
npm i nsp -g
```

Through GitHub:
```bash
git clone git@github.com:nodesecurity/nsp.git
cd nsp
npm link
```

# Usage

# `nsp audit-shrinkwrap`
Takes an existing npm-shrinkwrap.json file and submits it for validation to [nodesecurity.io](https://nodesecurity.io/)

**Example:**

```bash
$ nsp audit-shrinkwrap
Name     Installed  Patched  Vulnerable Dependency
connect    2.7.5    >=2.8.1  nodesecurity-jobs > kue > express
```

# `nsp audit-package`
Takes an existing package.json file and submits it for validation to [nodesecurity.io](https://nodesecurity.io/)

**Example:**

```bash
$ nsp audit-package
Name     Installed  Patched  Vulnerable Dependency
connect    2.7.5    >=2.8.1  nodesecurity-jobs > kue > express
```
