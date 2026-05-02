/**
 * HTML / XHTML content-type and charset coverage.
 *
 * Exercises the static fixture tree under /none, /utf-8, /shift_jis and
 * /euc-jp for both .html and .xhtml extensions and verifies that
 * expressCharset() preserves the base media type while attaching the
 * detected charset parameter.
 */

import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import supertest from "supertest"

import {expressCharset} from "../../lib/index.ts"
import {HTDOCS} from "./util.ts"
import type {ExpressFactory} from "./util.ts"

export const runHtmlTests = (label: string, express: ExpressFactory): void => {
    const types: { [ext: string]: string } = {
        html: "text/html",
        xhtml: "application/xhtml+xml",
    }

    describe(`${label}: html`, () => {
        const app = express()
        app.use(expressCharset())
        app.use((express as any).static(HTDOCS));
        const agent = supertest(app);

        ["html4.html", "html5.html", "xhtml.xhtml"].forEach(file => {
            const expectType = types[file.split(".").pop()!]

            it(`/none/${file}`, async () => {
                const res = await agent.get(`/none/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                const type = res.get("content-type")!.split(/;\s*/)
                assert.equal(type.shift(), expectType)
            })

            it(`/utf-8/${file}`, async () => {
                const res = await agent.get(`/utf-8/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                const type = res.get("content-type")!.split(/;\s*/)
                assert.equal(type.shift(), expectType)
                assert.equal(type.pop(), "charset=utf-8")
            })

            it(`/shift_jis/${file}`, async () => {
                const res = await agent.get(`/shift_jis/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                const type = res.get("content-type")!.split(/;\s*/)
                assert.equal(type.shift(), expectType)
                assert.equal(type.pop(), "charset=Shift_JIS")
            })

            it(`/euc-jp/${file}`, async () => {
                const res = await agent.get(`/euc-jp/${file}`)
                    .responseType("arraybuffer")
                    .expect(200)
                const type = res.get("content-type")!.split(/;\s*/)
                assert.equal(type.shift(), expectType)
                assert.equal(type.pop(), "charset=EUC-JP")
            })
        })
    })
}
