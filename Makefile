#!/usr/bin/env bash -c make

all: node_modules lib/index.js

clean:
	/bin/rm -f lib/*.js test/*.js

test: all mocha

node_modules:
	npm install

lib/%.js: lib/%.ts
	./node_modules/.bin/tsc -p .

test/%.js: test/%.ts
	./node_modules/.bin/tsc -p .

mocha: test/match.test.ts
	./node_modules/.bin/mocha test

.PHONY: all clean test
