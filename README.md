# markdownlint-rule-ascii-punctuation

A [markdownlint](https://github.com/DavidAnson/markdownlint) custom rule that reports typographic punctuation in prose that has a plain ASCII form.
Text quoted from a screen or a source is left alone, so a quotation stays exact.

The rule only reports problems and has no autofix, because a person picks each replacement.
An em-dash may become a comma, a colon, or a second sentence.

## Install

The package is not on the npm registry.
Install it from git, pinned to a tag:

```sh
npm install --save-dev github:teadatuntud/markdownlint-rule-ascii-punctuation#v1.0.0
```

The rule reads micromark tokens, so it needs markdownlint 0.36 or later.
markdownlint-cli2 includes that version from 0.15.0.

## Configure

Name the package in `customRules` and turn the rule on in `.markdownlint-cli2.yaml`:

```yaml
customRules:
  - markdownlint-rule-ascii-punctuation

config:
  ascii-punctuation: true
```

markdownlint-cli2 looks for the package from the directory of its config file.
A global install of markdownlint-cli2 therefore still finds a rule installed in the project.

To turn the rule off for some files, use an override:

```yaml
overrides:
  - filter:
      - "CHANGELOG.md"
    combine: merge
    config:
      ascii-punctuation: false
```

The rule has no options.

## What the rule reports

| Character                     | Example        | ASCII form          |
| ----------------------------- | -------------- | ------------------- |
| Em-dash                       | `a — b`        | a comma or a colon  |
| En-dash                       | `1990–1999`    | `1990-1999`         |
| Curly quotation mark          | `“a”`, `don’t` | `"a"`, `don't`      |
| Ellipsis character            | `wait…`        | `wait...`           |
| `--` standing in for a dash   | `a -- b`       | a comma or a colon  |

A `--` that touches other text, such as `--verbose` or `a--b`, is not reported.
Other non-ASCII characters, such as maths symbols, box drawing, and accented letters, are allowed.

The rule skips quotations, so these are not checked:

- code spans, fenced code blocks, and indented code blocks
- text between a pair of ASCII `"` marks, which may run across lines within a paragraph, heading, or table row
- text between a pair of typographic `“` and `”` marks on one line
- blockquotes, including nested and lazily continued lines

A backslash-escaped `\"` opens and closes nothing.
Emphasis is not a quotation, so prose that quotes the screen puts quotation marks around the text.

## Known limits

- A lone straight quote, such as an inch mark, opens a quotation that runs to the end of its paragraph, so a character after it is missed.
- A quotation that runs across a blank line closes at the end of its paragraph, so a character in the next paragraph is reported.
- A code span that runs across lines is not masked.
- A code span that holds a backtick, such as ``` ``a ` b`` ```, ends at that backtick.
- An HTML block is read as plain lines, so a line in it that looks like a blockquote or code is still checked.
- A `$$` maths block is read as plain lines in the same way.

## Develop

```sh
npm install
npm test
npm run lint
```

The fixtures in `test/` mark every line the rule must report with the word `FLAGME`.
The comment at the top of `test/rule.test.mjs` describes how the test reads them.

## Licence

The rule is released under the [MIT licence](LICENSE).
