// @ts-check

// Reports em-dashes, en-dashes, curly quotes, ellipsis characters, and `--`
// used as a dash. Quoted text is skipped, because changing it would make the
// quotation wrong.

/**
 * @typedef {import("markdownlint").MicromarkToken} Token
 */

// Written as escapes so this file stays ASCII.
/** @type {[RegExp, string][]} */
const REPORTED = [
  [/\u2014/g, "em-dash"],
  [/\u2013/g, "en-dash"],
  [/[\u2018\u2019\u201c\u201d]/g, "curly quotation mark"],
  [/\u2026/g, "ellipsis character"],
  [/(?<=^|\s)--(?=\s|$)/g, "`--` standing in for a dash"],
];

// Code spans and quotation mark pairs. Each is masked with filler of the same
// length, so a reported column still points at the right character.
const QUOTED = [/`+[^`]*`+/g, /"[^"]*"/g, /\u201c[^\u201d]*\u201d/g];

const ESCAPED_QUOTE = /\\"/g;

// Code and blockquotes are not checked.
const SKIPPED = new Set(["codeFenced", "codeIndented", "blockQuote"]);

// An ASCII quotation can run across lines, but only within one of these.
// Each item in a tight list has its own paragraph, so a quotation ends with
// its item.
const CARRY_BLOCKS = new Set([
  "paragraph",
  "atxHeading",
  "setextHeading",
  "tableRow",
]);

/**
 * Yields every token in the tree, parents first. markdownlint also parses the
 * inside of an HTML block as markdown and adds the result as its children.
 * The walk does not go into an HTML block, so its lines are checked as plain
 * text.
 *
 * @param {Token[]} tokens
 * @returns {Generator<Token>}
 */
function* walk(tokens) {
  for (const token of tokens) {
    yield token;
    if (token.type !== "htmlFlow") {
      yield* walk(token.children);
    }
  }
}

/**
 * Finds the lines to skip, and the block that each other line belongs to.
 * The parser decides both, because indentation cannot tell an indented code
 * block from a list item's continuation, and a nested or lazy blockquote line
 * need not start with `>`.
 *
 * @param {Token[]} tokens
 */
function classify(tokens) {
  /** @type {Set<number>} */
  const skipped = new Set();
  /** @type {Map<number, Token>} */
  const blocks = new Map();

  for (const token of walk(tokens)) {
    for (let line = token.startLine; line <= token.endLine; line += 1) {
      if (SKIPPED.has(token.type)) {
        skipped.add(line);
      } else if (CARRY_BLOCKS.has(token.type)) {
        blocks.set(line, token);
      }
    }
  }

  return { skipped, blocks };
}

/**
 * Masks the quoted text on one line. When `carried` is true, the line starts
 * inside a quotation that an earlier line opened. The returned `open` is true
 * when a quotation is still open at the end of the line.
 *
 * @param {string} line
 * @param {boolean} carried
 */
function mask(line, carried) {
  // An escaped quote is a literal character, so it neither opens nor closes.
  let masked = line.replace(ESCAPED_QUOTE, "XX");

  // The carried quotation runs to the first quote on this line, or to the end
  // of the line if there is none.
  if (carried) {
    const close = masked.indexOf('"');
    if (close === -1) {
      return { masked: "X".repeat(masked.length), open: true };
    }
    masked = "X".repeat(close + 1) + masked.slice(close + 1);
  }

  for (const pattern of QUOTED) {
    masked = masked.replace(pattern, (match) => "X".repeat(match.length));
  }

  // Pairs are masked by now, so a quote that is left over is unclosed.
  const open = (masked.match(/"/g) || []).length % 2 === 1;

  return { masked, open };
}

/** @type {import("markdownlint").Rule} */
const rule = {
  "names": ["ascii-punctuation"],
  "description":
    "No em-dashes, en-dashes, curly quotes, or ellipsis characters",
  "information": new URL(
    "https://github.com/teadatuntud/markdownlint-rule-ascii-punctuation#readme",
  ),
  "tags": ["style", "prose"],
  "parser": "micromark",
  // fixInfo is left out because the replacement may be a comma, a colon, or a
  // new sentence, and a person has to choose.
  "function": (params, onError) => {
    const { skipped, blocks } = classify(params.parsers.micromark.tokens);
    let carried = false;
    /** @type {Token | undefined} */
    let block;

    params.lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // A quotation ends when its block ends.
      const here = blocks.get(lineNumber);
      if (here !== block) {
        carried = false;
        block = here;
      }

      if (skipped.has(lineNumber)) {
        return;
      }

      const { masked, open } = mask(line, carried);
      carried = open;
      for (const [pattern, name] of REPORTED) {
        for (const match of masked.matchAll(pattern)) {
          onError({
            "lineNumber": lineNumber,
            "detail": `${name} at column ${match.index + 1}`,
            "context": line.trim().slice(0, 60),
          });
        }
      }
    });
  },
};

export default rule;
