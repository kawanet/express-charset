/**
 * https://github.com/kawanet/express-charset
 */

import type * as types from "express-charset"
import {requestHandler} from "express-intercept"
import {htmlHandler} from "./html.ts"
import {cssHandler} from "./css.ts"
import {xmlHandler} from "./xml.ts"

export const expressCharset: typeof types.expressCharset = () => {
    const html = htmlHandler()
    const css = cssHandler()
    const xml = xmlHandler()
    return requestHandler().use(html, css, xml)
}
