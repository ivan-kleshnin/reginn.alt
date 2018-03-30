import * as R from "ramda"
import P from "parsimmon"

let Argv = P.createLanguage({
  expression: function (L) {
    return P
      .alt(L.word, L.string, L.options)
      .sepBy(P.whitespace)
      .trim(P.optWhitespace)
  },

  options: function (L) {
    return L.option.sepBy(P.whitespace).map(R.fromPairs)
  },

  option: function (L) {
    // one of possible quotes, then sequence of anything except that quote (unless escaped), then the same quote
    return P.seq(
      P.alt(
        P.string("-").then(P.regex(/[a-z]/)),
        P.string("--").then(L.word),
      ),
      P.alt(
        P.string("=").then(L.word),
        P.of(true),
      )
    )
  },

  string: function (L) {
    // one of possible quotes, then sequence of anything except that quote (unless escaped), then the same quote
    return P
      .oneOf(`"'`)
      .chain(q =>
        P.alt(
          P.noneOf(`\\${q}`).atLeast(1).tie(), // everything but quote and escape sign
          P.string(`\\`).then(P.any),          // escape sequence like \"
        )
        .many().tie()
        .skip(P.string(q))
      )
  },

  word: function (L) {
    // 1 char of anything except forbidden symbols and dash, then 0+ chars of anything except forbidden symbols
    return P.regex(/[^-=\s"'][^=\s"']*/)
  },
})

let parser = Argv.expression

export default parser.parse.bind(parser)

/*
Intentionally not supported:

  1) Space-delemited flag values

  ```
  $ command --foo FOO
  as
  $ command --foo=FOO
  ```

  because it's non-context-free. It's impossible to tell if `FOO` related to `command` or `--foo`
  without an intimate knowledge of exact flags (which couples parser and application).

  2) Flag joining

  ```
  $ command -fgh
  as
  $ command -f -g -h
  ```

  I just don't like this style. It's easy to confuse `-any` and `--any`.
*/
