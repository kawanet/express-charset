/**
 * Parallel test entry for the Express 4 line.
 */

import express from "express4"
import {
    runCompressedTests,
    runCssTests,
    runHtmlTests,
    runLargeHeadTests,
    runXmlTests,
} from "./lib/shared.ts"

const LABEL = "express4"

runHtmlTests(LABEL, express as unknown as () => any)
runCssTests(LABEL, express as unknown as () => any)
runXmlTests(LABEL, express as unknown as () => any)
runLargeHeadTests(LABEL, express as unknown as () => any)
runCompressedTests(LABEL, express as unknown as () => any)
