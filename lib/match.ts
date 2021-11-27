/**
 * https://github.com/kawanet/express-charset
 */

export function matchBuffer(data: Buffer, regexp: RegExp, tag: string) {
    const {length} = data

    const open = tag.charCodeAt(0) || 0
    const close = tag.charCodeAt(tag.length - 1) || -1

    for (let i = 0; i < length; i++) {

        // find the open character
        for (; i < length; i++) {
            const c = data[i]
            if (c > 0x7E) return; // non US-ASCII
            if (c === open) break;
        }

        const pos = i

        // find the close character or a line break
        for (; i < length; i++) {
            const c = data[i]
            if (c === close) break;
            if (c === 0x0A) break; // LF
            if (c === 0x0D) break; // CR
            if (c > 0x7E) return; // non US-ASCII
        }

        if (pos === i) continue
        const line = String(data.subarray(pos, i + 1))
        const matched = line.match(regexp)

        // matched
        if (matched?.length) return matched
    }

    // unmatched
    return
}
