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
        it("/none/data.xml", async () => {
            await agent.get("/none/data.xml")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "application/xml")
                })
        })
    }
    {
        it("/utf-8/data.xml", async () => {
            await agent.get("/utf-8/data.xml")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "application/xml; charset=utf-8")
                })
        })
    }
    {
        it("/shift_jis/data.xml", async () => {
            await agent.get("/shift_jis/data.xml")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "application/xml; charset=Shift_JIS")
                })
        })
    }
    {
        it("/euc-jp/data.xml", async () => {
            await agent.get("/euc-jp/data.xml")
                .responseType("arraybuffer")
                .expect(200)
                .then(res => {
                    const type = res.get("content-type")
                    assert.equal(type, "application/xml; charset=EUC-JP")
                })
        })
    }
})
