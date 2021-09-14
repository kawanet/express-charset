/**
 * https://github.com/kawanet/express-charset
 */

import {responseHandler} from "express-intercept"
import {matchBuffer} from "./match"

export function htmlHandler() {
    return responseHandler()
        .if(res => {
            const type = String(res.getHeader("content-type"))

            /**
             * express.static() uses mime module version 1.x which assumes any text types are utf8, surprisingly.
             * https://github.com/broofa/mime/blob/v1.x/mime.js#L101
             * Content-Type: text/html; charset=UTF-8
             */
            return /^text\/html/.test(type) && (!/charset=/.test(type) || /charset=UTF-8/.test(type))
        })
        .getBuffer((body, _, res) => {
            const tags = matchBuffer(body, /<meta(?:.*?\Wcharset=.*?)\/?>/ig)
            if (!tags) return

            let newType: string | undefined
            for (const tag of tags) {
                /**
                 * <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                 */
                if (/\Whttp-equiv=['"]?Content-Type['"]?/i.test(tag)) {
                    newType = tag.split(/\Wcontent=['"]?([^'">]+)/i)[1]
                }

                /**
                 * <meta charset="utf-8"/>
                 */
                if (/meta\s+charset=/i.test(tag)) {
                    const oldType = String(res!.getHeader("content-type")).replace(/;\s*charset=[^;]+/, "")
                    const charset = tag.split(/\Wcharset=['"]?([^'"/]+)/i)[1]
                    if (charset) newType = `${oldType}; charset=${charset}`
                }

                if (newType) break
            }
            if (newType) {
                res!.setHeader("content-type", newType)
            }
        })
}
