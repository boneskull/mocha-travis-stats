# mocha-travis-stats

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Generates some build stats for Mocha

This retrieves and dumps stats about [Mocha](https://mochajs.org)'s [builds](https://travis-ci.org/mochajs/mocha) on [Travis CI](https://travis-ci.org).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

Requires Node.js 8 or newer.

`git clone` this repo, and execute `npm install` from the resulting working copy.

## Usage

Follow [these steps](https://developer.travis-ci.com/authentication) to get a token.

```bash
$ TRAVIS_CI_TOKEN=<YOUR_TOKEN> node src/travis-stats.js
```

## Maintainers

[@boneskull](https://github.com/boneskull)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Christopher Hiller
