/**
 * Shared test bodies used by both express4 and express5 test files.
 *
 * Each helper takes the Express factory as an argument and exercises the
 * expressCharset() middleware on an app built from it.
 */

import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import path from "node:path"
import {fileURLToPath} from "node:url"
import supertest from "supertest"
import {responseHandler} from "express-intercept"

import {expressCharset} from "../../lib/index.ts"

// Both Express versions share the same test/htdocs/ tree.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const HTDOCS = path.join(__dirname, "..", "htdocs")

// Node 22+ assert.match is fine to assume here.
const assert_match = (str: string, re: RegExp): void => {
    assert.ok(re.test(str), JSON.stringify({expected: re.source, actual: str}))
}

type ExpressFactory = () => any

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

export const runCssTests = (label: string, express: ExpressFactory): void => {
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

export const runXmlTests = (label: string, express: ExpressFactory): void => {
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

export const runLargeHeadTests = (label: string, express: ExpressFactory): void => {
    describe(`${label}: large-head`, () => {
        const app = express()
        app.use(expressCharset())
        app.use((express as any).static(HTDOCS))
        const agent = supertest(app)

        const files: { [path: string]: RegExp } = {
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

export const runCompressedTests = (label: string, express: ExpressFactory): void => {
    describe(`${label}: compressed`, () => {
        const app = express()
        app.use(expressCharset())
        app.use(responseHandler().compressResponse())
        app.use((express as any).static(HTDOCS))
        const agent = supertest(app)

        const encodings = ["gzip", "deflate"]
        const files: { [path: string]: RegExp } = {
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
