# express-charset

[![Node.js CI](https://github.com/kawanet/express-charset/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/express-charset/actions/)
[![npm version](https://img.shields.io/npm/v/express-charset)](https://www.npmjs.com/package/express-charset)

Set `Content-Type: text/xxxx; charset=xxxx` for HTML/CSS/XML files.

## SYNOPSIS

```js
const express = require("express");
const {expressCharset} = require("express-charset");

const app = express();
app.use(expressCharset());
app.use(express.static("htdocs"));
app.listen(3000);
```

This does not _"guess"_ character encoding but detect it declared at the first 1KB of response content body.

```text
$ grep charset htdocs/shift_jis/html5.html 
  <meta charset="Shift_JIS">

$ curl -sv http://127.0.0.1:3000/shift_jis/html5.html 2>&1 | grep -i content-type:
< content-type: text/html; charset=Shift_JIS

$ grep charset htdocs/euc-jp/style.css 
@charset "EUC-JP";

$ curl -sv http://127.0.0.1:3000/euc-jp/style.css 2>&1 | grep -i content-type:
< content-type: text/css; charset=EUC-JP

$ grep encoding htdocs/utf-8/data.xml 
<?xml version="1.0" encoding="utf-8" ?>

$ curl -sv http://127.0.0.1:3000/utf-8/data.xml 2>&1 | grep -i content-type:
< content-type: application/xml; charset=utf-8
```

### LINKS

- https://github.com/kawanet/express-charset
- https://www.npmjs.com/package/weboverlay
- https://www.npmjs.com/package/express-intercept
- https://www.npmjs.com/package/express-charset

### LICENSE

MIT License

Copyright (c) 2021 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
