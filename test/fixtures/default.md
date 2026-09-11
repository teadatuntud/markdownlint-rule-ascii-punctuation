# Fixtures for ascii-punctuation

The rule must report every line marked with the word in the test, and no other line.

## Reported characters

An em-dash — in prose is FLAGME.
An en-dash in 1990–1999 is FLAGME.
A curly ‘single’ pair is FLAGME.
An apostrophe in don’t is FLAGME.
A lone curly “ opening mark is FLAGME.
A single-character ellipsis… is FLAGME.
A double hyphen -- standing in for a dash is FLAGME.
-- A double hyphen at the start of a line is FLAGME.
A double hyphen at the end of a line is FLAGME --

## Allowed characters

A plain hyphen - and an ASCII ellipsis ... are allowed.
A command-line flag such as --verbose is allowed.
A double hyphen inside a word, as in a--b, is allowed.
Maths symbols such as × and ≤ are allowed, and so is box drawing such as ┌─┐.

## Code

A code span such as `a — b` is a quotation.

```text
A fenced block — is skipped.
```

    An indented block — is skipped.

## Quotations

The screen says "Saving… done" when it finishes.
A typographic pair “Saving — done” is a quotation.
An ASCII pair may run "across the
line break — like this" and stay a quotation.
A second em-dash after the closing mark — is FLAGME.

An ASCII pair can carry "over several lines,
through a whole line — like this one,
and close here — at the mark" and stop.

An escaped mark \" opens nothing, so this — is FLAGME.
An escaped mark inside a pair "says \" — still quoted" here.

## Carry stops at the block

A quotation opens " here and never closes.

So this em-dash — in the next paragraph is FLAGME.

## Opened in a heading "and left open

A paragraph under the heading — is FLAGME.

- A list item opens " a quotation.
- The next item — is FLAGME.

| Column "one | Column two |
| ----------- | ---------- |
| A cell — is | FLAGME     |

## Blockquotes

> A blockquote line — is a quotation.
> > A nested one — is too.
> A lazily continued
line — is too.

## List items

- A list item — is FLAGME.

  A continuation paragraph — is FLAGME.

      A code block in a list item — is skipped.

## Emphasis

Emphasis such as *Saving — done* is not a quotation, so it is FLAGME.
