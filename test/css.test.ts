#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert"
import * as express from "express"
import * as supertest from "supertest"

import {expressCharset} from "../"

const TITLE = __filename.split("/").pop()!

describe(TITLE, () => {

    const app = express()
    app.use(expressCharset())
    app.use(express.static(`${__dirname}/htdocs/`))
    const agent = supertest(app)

    {
        /**
         * express.static() uses mime module version 1.x which assumes any text types are utf8, surprisingly.
         * https://github.com/broofa/mime/blob/v1.x/mime.js#L101
         * Content-Type: text/css; charset=UTF-8
         */
        it("/none/style.css", async () => {
            await agent.get("/none/style.css")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type.split(";").shift(), "text/css")
                })
        })
    }
    {
        it("/utf-8/style.css", async () => {
            await agent.get("/utf-8/style.css")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "text/css; charset=utf-8")
                })
        })
    }
    {
        it("/shift_jis/style.css", async () => {
            await agent.get("/shift_jis/style.css")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "text/css; charset=Shift_JIS")
                })
        })
    }
    {
        it("/euc-jp/style.css", async () => {
            await agent.get("/euc-jp/style.css")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "text/css; charset=EUC-JP")
                })
        })
    }
})
