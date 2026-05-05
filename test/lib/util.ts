/**
 * Shared helpers for the per-topic test modules under test/lib/.
 *
 * Each topic module imports HTDOCS (the static fixture root) and
 * assert_match (a small wrapper around assert.ok with a RegExp test).
 */

import {strict as assert} from "node:assert"
import path from "node:path"
import {fileURLToPath} from "node:url"

// Both Express versions share the same test/htdocs/ tree.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const HTDOCS = path.join(__dirname, "..", "htdocs")

// Node 22+ assert.match is fine to assume here.
export const assert_match = (str: string, re: RegExp): void => {
    assert.ok(re.test(str), JSON.stringify({expected: re.source, actual: str}))
}

// The full Express module/namespace value: call signature + namespace
// methods (`.static`, `.Router`, `.json`, ...). Express ships as a
// CommonJS `export = e` namespace, so `typeof import("express")`
// resolves to the value of `import express from "express"` directly
// (no `.default`). This repo pins `@types/express` to `^5`, so the
// type baseline here is Express 5.
export type ExpressModule = typeof import("express")
