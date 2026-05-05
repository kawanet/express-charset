/**
 * XML (application/xml) charset coverage.
 *
 * Confirms that the middleware preserves application/xml as the base
 * type and surfaces the encoding declared inside each fixture as the
 * content-type charset parameter.
 */

import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import supertest from "supertest"

import {expressCharset} from "../../lib/index.ts"
import {HTDOCS} from "./util.ts"
import type {ExpressModule} from "./util.ts"

export const runXmlTests = (label: string, express: ExpressModule): void => {
    describe(`${label}: xml`, () => {
        const app = express()
        app.use(expressCharset())
        app.use((express as any).static(HTDOCS))
        const agent = supertest(app)

        it("/none/data.xml", async () => {
            const res = await agent.get("/none/data.xml")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "application/xml")
        })

        it("/utf-8/data.xml", async () => {
            const res = await agent.get("/utf-8/data.xml")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "application/xml; charset=utf-8")
        })

        it("/shift_jis/data.xml", async () => {
            const res = await agent.get("/shift_jis/data.xml")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "application/xml; charset=Shift_JIS")
        })

        it("/euc-jp/data.xml", async () => {
            const res = await agent.get("/euc-jp/data.xml")
                .responseType("arraybuffer")
                .expect(200)
            assert.equal(res.get("content-type"), "application/xml; charset=EUC-JP")
        })
    })
}
