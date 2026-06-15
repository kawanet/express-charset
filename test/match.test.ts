import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import {matchBuffer} from "../lib/match.ts"

describe("match.test.ts", () => {
    it("matchBuffer", () => {
        const data = Buffer.from(`<foo>\n<bar/>\n<buz></buz>\n</foo>`)
        const matched = matchBuffer(data, /<bar.*>/, "<>")
        assert.ok(matched?.[0])
        assert.deepEqual(matched[0], "<bar/>")
    })
})
