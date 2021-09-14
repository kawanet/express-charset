#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert"
import {matchBuffer} from "../lib/match";

const TITLE = __filename.split("/").pop()!

describe(TITLE, () => {

    it("matchBuffer", () => {
        const data = Buffer.from(`<foo>\n<bar/>\n<buz></buz>\n</foo>`)
        const matched = matchBuffer(data, /<bar.*>/);
        assert.ok(matched?.[0]);
        assert.deepEqual(matched[0], "<bar/>");
    })
})
