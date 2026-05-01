SRC := $(wildcard ../lib/*.ts)
TYPES := $(wildcard ../types/*.d.ts)
BUILDER_SRC := $(wildcard ./*.ts)

PKG_DST := ../dist/package.json
MJS_DST := ../dist/express-charset.mjs
CJS_DST := ../dist/express-charset.cjs

MJS_CONFIG := ./rollup-mjs.config.ts
CJS_CONFIG := ./rollup-cjs.config.ts

# Bundle should stay tiny — lib/ is a few small files and express-intercept
# is kept external. If the size jumps, it usually means a Node built-in or
# a transitive dep got bundled by accident — fail the build.
MAX_BYTES := 8000

# Every named export the package documents must survive the round trip
# through both CJS and ESM bundles. List them once and assert in both
# smoke checks below.
NAMED_EXPORTS := expressCharset

ALL := $(MJS_DST) $(CJS_DST) $(PKG_DST)

####

all: $(ALL)

$(PKG_DST):
	@mkdir -p $(dir $@)
	echo '{"type":"commonjs"}' > $@
	@ls -l $@
	@echo ""

$(MJS_DST): $(MJS_CONFIG) $(SRC) $(BUILDER_SRC)
	@mkdir -p $(dir $@)
	../node_modules/.bin/rollup -c $<
	@test "$$(wc -c < $@)" -le $(MAX_BYTES) || { echo "ERROR: $@ exceeds $(MAX_BYTES) byte cap" >&2; exit 1; }
	@ls -l $@
	@echo ""

$(CJS_DST): $(CJS_CONFIG) $(SRC) $(BUILDER_SRC)
	@mkdir -p $(dir $@)
	../node_modules/.bin/rollup -c $<
	@test "$$(wc -c < $@)" -le $(MAX_BYTES) || { echo "ERROR: $@ exceeds $(MAX_BYTES) byte cap" >&2; exit 1; }
	@ls -l $@
	@echo ""

####

# Build, type-check, smoke-check that both bundles expose every named
# export, and run the node:test suite against the source.
test: all $(TYPES)
	../node_modules/.bin/tsc --noEmit
	cd .. && node -e 'const m = require("./dist/express-charset.cjs"); for (const k of "$(NAMED_EXPORTS)".split(" ")) if (typeof m[k] !== "function") { console.error("missing CJS export:", k); process.exit(1); } console.log("CJS smoke OK")'
	cd .. && node --input-type=module -e 'const m = await import("./dist/express-charset.mjs"); for (const k of "$(NAMED_EXPORTS)".split(" ")) if (typeof m[k] !== "function") { console.error("missing MJS export:", k); process.exit(1); } console.log("MJS smoke OK")'
	cd .. && node --test test/*.test.ts

clean:
	/bin/rm -fr $(ALL)

.PHONY: all clean test
