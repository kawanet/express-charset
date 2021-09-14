/**
 * https://github.com/kawanet/express-charset
 */

import type {RequestHandler} from "express";
import {requestHandler} from "express-intercept"
import {htmlHandler} from "./html"
import {cssHandler} from "./css"
import {xmlHandler} from "./xml"

export const expressCharset = (): RequestHandler => {
    const html = htmlHandler()
    const css = cssHandler()
    const xml = xmlHandler()
    return requestHandler().use(html, css, xml)
}