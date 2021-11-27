#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert"
import * as express from "express"
import * as supertest from "supertest"

import {expressCharset} from "../"

const TITLE = __filename.split("/").pop()!

// assert.match
const assert_match = assert.match || ((str: string, re: RegExp): void => {
    assert.ok(re.test(str), JSON.stringify({expected: re.source, actual: str}));
});

describe(TITLE, () => {

    const app = express()
    app.use(expressCharset())
    app.use(express.static(`${__dirname}/htdocs/`))
    const agent = supertest(app);

    const files = {
        "/large-head/1kb.html": /EUC-JP/,
        "/large-head/2kb.html": /EUC-JP/,
        "/large-head/3kb.html": /EUC-JP/,
        "/large-head/4kb.html": /EUC-JP/,
    };

    Object.keys(files).forEach((path: keyof typeof files) => {
        it(path, async () => {
            const regexp = files[path];

            await agent.get(path)
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type").split(/;\s*/)
                    assert.equal(type.shift(), "text/html")
                    assert_match(String(type.pop()), regexp)
                    assert_match(String(res.body), /<\/html>/)
                })
        })
    })
})
