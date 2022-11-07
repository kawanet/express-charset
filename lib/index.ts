/**
 * https://github.com/kawanet/express-charset
 */

import type * as types from "../types/express-charset"
import {requestHandler} from "express-intercept"
import {htmlHandler} from "./html"
import {cssHandler} from "./css"
import {xmlHandler} from "./xml"

export const expressCharset: typeof types.expressCharset = () => {
    const html = htmlHandler()
    const css = cssHandler()
    const xml = xmlHandler()
    return requestHandler().use(html, css, xml)
}