/**
 * Parallel test entry for the Express 5 line.
 */

import express from "express5"
import {
    runCompressedTests,
    runCssTests,
    runHtmlTests,
    runLargeHeadTests,
    runXmlTests,
} from "./lib/shared.ts"

const LABEL = "express5"

runHtmlTests(LABEL, express as unknown as () => any)
runCssTests(LABEL, express as unknown as () => any)
runXmlTests(LABEL, express as unknown as () => any)
runLargeHeadTests(LABEL, express as unknown as () => any)
runCompressedTests(LABEL, express as unknown as () => any)
