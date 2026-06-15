/**
 * Large <head> charset detection coverage.
 *
 * Each fixture pads the HTML <head> with progressively larger amounts of
 * filler so the meta charset declaration appears at varying offsets.
 * The middleware must still find it and emit charset=EUC-JP.
 */

import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import supertest from "supertest"

import {expressCharset} from "../../lib/index.ts"
import {assert_match, HTDOCS} from "./util.ts"
import type {ExpressModule} from "./util.ts"

export const runLargeHeadTests = (label: string, express: ExpressModule): void => {
    describe(`${label}: large-head`, () => {
        const app = express()
        app.use(expressCharset())
        app.use((express as any).static(HTDOCS))
        const agent = supertest(app)

        const files: {[path: string]: RegExp} = {
            "/large-head/1kb.html": /EUC-JP/,
            "/large-head/2kb.html": /EUC-JP/,
            "/large-head/3kb.html": /EUC-JP/,
            "/large-head/4kb.html": /EUC-JP/,
        }

        for (const p of Object.keys(files)) {
            it(p, async () => {
                const regexp = files[p]
                const res = await agent.get(p)
                    .responseType("arraybuffer")
                    .expect(200)
                const type = res.get("content-type")!.split(/;\s*/)
                assert.equal(type.shift(), "text/html")
                assert_match(String(type.pop()), regexp)
                assert_match(String(res.body), /<\/html>/)
            })
        }
    })
}
