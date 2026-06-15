/**
 * Parallel test entry for the Express 5 line.
 *
 * Imports each per-topic suite from test/lib/ and runs them as describe
 * blocks against the Express 5 factory.
 */

import express from "express5"
import {runCompressedTests} from "./lib/compressed.ts"
import {runCssTests} from "./lib/css.ts"
import {runHtmlTests} from "./lib/html.ts"
import {runLargeHeadTests} from "./lib/large-head.ts"
import type {ExpressModule} from "./lib/util.ts"
import {runXmlTests} from "./lib/xml.ts"

const LABEL = "express5"

runHtmlTests(LABEL, express as unknown as ExpressModule)
runCssTests(LABEL, express as unknown as ExpressModule)
runXmlTests(LABEL, express as unknown as ExpressModule)
runLargeHeadTests(LABEL, express as unknown as ExpressModule)
runCompressedTests(LABEL, express as unknown as ExpressModule)
