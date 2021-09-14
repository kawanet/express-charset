/**
 * https://github.com/kawanet/express-charset
 */

import {responseHandler} from "express-intercept"
import {matchBuffer} from "./match"

export function xmlHandler() {
    return responseHandler()
        .if(res => {
            const type = String(res.getHeader("content-type"))
            return /^(text|application)\//.test(type) && /\W(xml|x-html)(\W|$)/.test(type) && !/charset=/.test(type)
        })
        .getBuffer((body, _, res) => {
            const charset = xmlCharset(body)
            if (!charset) return

            const oldType = String(res!.getHeader("content-type")).replace(/;\s*charset=[^;]+/, "")
            const newType = `${oldType}; charset=${charset}`
            res!.setHeader("content-type", newType)
        })
}

function xmlCharset(data: Buffer): string | undefined {
    const tags = matchBuffer(data, /<\?xml.*?encoding=.*?\?>/ig)
    if (!tags) return

    for (const tag of tags) {
        /**
         * <?xml version="1.0" encoding="UTF-8"?>
         */
        const charset = tag.split(/\Wencoding=['"]?([^'"?]+)/i)[1]
        if (charset) return charset
    }
}