/**
 * https://github.com/kawanet/express-charset
 */

export function matchBuffer(data: Buffer, regexp: RegExp) {
    const {length} = data

    for (let i = 0; i < length; i++) {
        let j = i
        for (; j < length; j++) {
            const c = data[i]
            if (c === 0x0A) break; // LF
            if (c === 0x0D) break; // CR
            if (c > 0x7E) break; // non US-ASCII
        }
        if (i === j) continue

        const matched = data.subarray(i, j).toString().match(regexp)

        // matched
        if (matched?.length) return matched
    }

    // unmatched
    return
}
