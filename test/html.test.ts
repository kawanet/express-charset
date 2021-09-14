#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert"
import * as express from "express"
import * as supertest from "supertest"

import {expressCharset} from "../"

const TITLE = __filename.split("/").pop()!

const types: { [ext: string]: string } = {
    html: "text/html",
    xhtml: "application/xhtml+xml",
}

describe(TITLE, () => {

    const app = express()
    app.use(expressCharset())
    app.use(express.static(`${__dirname}/htdocs/`))
    const agent = supertest(app);

    ["html4.html", "html5.html", "xhtml.xhtml"].forEach(file => {
        const expectType = types[file.split(".").pop()!];

        {
            it(`/none/${file}`, async () => {
                await agent.get(`/none/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                    .then(res => {
                        const type = res.get("content-type").split(/;\s*/)
                        assert.equal(type.shift(), expectType)

                        /**
                         * express.static() uses mime module version 1.x which assumes any text types are utf8, surprisingly.
                         * https://github.com/broofa/mime/blob/v1.x/mime.js#L101
                         * Content-Type: text/html; charset=UTF-8
                         */
                        // assert.equal(type.pop(), undefined)
                    })
            })
        }
        {
            it(`/utf-8/${file}`, async () => {
                await agent.get(`/utf-8/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                    .then(res => {
                        const type = res.get("content-type").split(/;\s*/)
                        assert.equal(type.shift(), expectType)
                        assert.equal(type.pop(), "charset=utf-8")
                    })
            })
        }
        {
            it(`/shift_jis/${file}`, async () => {
                await agent.get(`/shift_jis/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                    .then(res => {
                        const type = res.get("content-type").split(/;\s*/)
                        assert.equal(type.shift(), expectType)
                        assert.equal(type.pop(), "charset=Shift_JIS")
                    })
            })
        }
        {
            it(`/euc-jp/${file}`, async () => {
                await agent.get(`/euc-jp/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                    .then(res => {
                        const type = res.get("content-type").split(/;\s*/)
                        assert.equal(type.shift(), expectType)
                        assert.equal(type.pop(), "charset=EUC-JP")
                    })
            })
        }
    })
})
