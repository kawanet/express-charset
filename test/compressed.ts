#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert"
import * as express from "express"
import * as supertest from "supertest"
import {responseHandler} from "express-intercept";

import {expressCharset} from "../"

const TITLE = __filename.split("/").pop()!

// assert.match
const assert_match = assert.match || ((str: string, re: RegExp): void => {
    assert.ok(re.test(str), JSON.stringify({expected: re.source, actual: str}));
});

describe(TITLE, () => {

    const app = express()
    app.use(expressCharset())
    app.use(responseHandler().compressResponse())
    app.use(express.static(`${__dirname}/htdocs/`))
    const agent = supertest(app);

    const encodings = ["gzip", "deflate"];

    const files = {
        "/euc-jp/html5.html": /EUC-JP/,
        "/shift_jis/html5.html": /Shift_JIS/,
        "/utf-8/html5.html": /utf-8/,
    };

    Object.keys(files).forEach((path: keyof typeof files) => {
        encodings.forEach(encoding => {
            it(`${path} (${encoding})`, async () => {
                const regexp = files[path];

                await agent.get(path)
                    .set("accept-encoding", encoding)
                    .responseType("arraybuffer")
                    .expect(200)
                    .then(res => {
                        const type = res.get("content-type").split(/;\s*/)
                        assert.equal(type.shift(), "text/html")
                        assert_match(String(type.pop()), regexp)
                        assert_match(String(res.body), /<\/html>/)

                        const contentEncoding = res.get("content-encoding")
                        assert.equal(contentEncoding, encoding)
                    })
            })
        })
    })
})
