/**
 * Parallel test entry for the Express 4 line.
 *
 * Imports each per-topic suite from test/lib/ and runs them as describe
 * blocks against the Express 4 factory.
 */

import express from "express4"

import {runCompressedTests} from "./lib/compressed.ts"
import {runCssTests} from "./lib/css.ts"
import {runHtmlTests} from "./lib/html.ts"
import {runLargeHeadTests} from "./lib/large-head.ts"
import {runXmlTests} from "./lib/xml.ts"

const LABEL = "express4"

runHtmlTests(LABEL, express as unknown as () => any)
runCssTests(LABEL, express as unknown as () => any)
runXmlTests(LABEL, express as unknown as () => any)
runLargeHeadTests(LABEL, express as unknown as () => any)
runCompressedTests(LABEL, express as unknown as () => any)
