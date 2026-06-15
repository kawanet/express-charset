/**
 * Stylesheet (text/css) charset coverage.
 *
 * Verifies that expressCharset() leaves the bare text/css content-type
 * untouched when no charset can be detected, and otherwise appends
 * the charset parameter discovered from the file fixture.
 */

import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import supertest from "supertest"
import {expressCharset} from "../../lib/index.ts"
import type {ExpressModule} from "./util.ts"
import {HTDOCS} from "./util.ts"

export const runCssTests = (label: string, express: ExpressModule): void => {
    describe(`${label}: css`, () => {
        const app = express()
        app.use(expressCharset())
        app.use((express as any).static(HTDOCS))
        const agent = supertest(app)

        it("/none/style.css", async () => {
            const res = await agent.get("/none/style.css")
                .responseType("arraybuffer")
                .expect(200)
            const type = res.get("content-type")!
            assert.equal(type.split(";").shift(), "text/css")
        })

        it("/utf-8/style.css", async () => {
            const res = await agent.get("/utf-8/style.css")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "text/css; charset=utf-8")
        })

        it("/shift_jis/style.css", async () => {
            const res = await agent.get("/shift_jis/style.css")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "text/css; charset=Shift_JIS")
        })

        it("/euc-jp/style.css", async () => {
            const res = await agent.get("/euc-jp/style.css")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "text/css; charset=EUC-JP")
        })
    })
}
