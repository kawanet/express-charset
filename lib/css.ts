/**
 * https://github.com/kawanet/express-charset
 */

import {responseHandler} from "express-intercept"
import {matchBuffer} from "./match"

export function cssHandler() {
    return responseHandler()
        .if(res => {
            const type = String(res.getHeader("content-type"))

            /**
             * express.static() uses mime module version 1.x which assumes any text types are utf8, surprisingly.
             * https://github.com/broofa/mime/blob/v1.x/mime.js#L101
             * Content-Type: text/css; charset=UTF-8
             */
            return /^text\/css/.test(type) && (!/charset=/.test(type) || /charset=UTF-8/.test(type))
        })
        .getBuffer((body, _, res) => {

            const charset = cssCharset(body);
            if (!charset) return

            const oldType = String(res!.getHeader("content-type")).replace(/;\s*charset=[^;]+/, "")
            const newType = `${oldType}; charset=${charset}`
            res!.setHeader("content-type", newType)
        })
}

/**
 * @charset "utf-8"
 */

function cssCharset(data: Buffer): string | undefined {
    const tags = matchBuffer(data, /@charset[^;]+/ig, "@;")
    if (!tags) return

    for (const tag of tags) {
        const charset = tag.split(/@charset\s+['"]?([^'";]+)/i)[1]
        if (charset) return charset;
    }
}