/**
 * Compressed (gzip / deflate) response charset coverage.
 *
 * Stacks express-intercept's compressResponse() after expressCharset()
 * so the middleware must inspect the response body before it gets
 * compressed and still emit the correct charset parameter.
 */

import {responseHandler} from "express-intercept"
import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import supertest from "supertest"

import {expressCharset} from "../../lib/index.ts"
import type {ExpressModule} from "./util.ts"
import {assert_match, HTDOCS} from "./util.ts"

export const runCompressedTests = (label: string, express: ExpressModule): void => {
    describe(`${label}: compressed`, () => {
        const app = express()
        app.use(expressCharset())
        app.use(responseHandler().compressResponse())
        app.use((express as any).static(HTDOCS))
        const agent = supertest(app)

        const encodings = ["gzip", "deflate"]
        const files: {[path: string]: RegExp} = {
            "/euc-jp/html5.html": /EUC-JP/,
            "/shift_jis/html5.html": /Shift_JIS/,
            "/utf-8/html5.html": /utf-8/,
        }

        for (const p of Object.keys(files)) {
            for (const encoding of encodings) {
                it(`${p} (${encoding})`, async () => {
                    const regexp = files[p]
                    const res = await agent.get(p)
                        .set("accept-encoding", encoding)
                        .responseType("arraybuffer")
                        .expect(200)
                    const type = res.get("content-type")!.split(/;\s*/)
                    assert.equal(type.shift(), "text/html")
                    assert_match(String(type.pop()), regexp)
                    assert_match(String(res.body), /<\/html>/)
                    assert.equal(res.get("content-encoding"), encoding)
                })
            }
        }
    })
}
