# Known limits

Each section pins one limit from the README, so a change to a limit updates both.

## A lone straight quote

A 5" floppy disk opens a quotation,
so this em-dash — is missed.

## A quotation across paragraphs

The quotation "opens here,

and this em-dash — before the closing mark is FLAGME."

## A code span across lines

A code span that starts `here and
— ends here` is not masked, so the line is FLAGME.

## A backtick inside a code span

A code span such as ``a ` — b`` that holds a backtick ends at it, so the line is FLAGME.

## An HTML block

<div>
An HTML block — is checked as prose, so the line is FLAGME.
> A line that looks like a blockquote — is FLAGME.
    A line that looks like code — is FLAGME.
A quotation "may carry
# over a line that looks like a heading — and close" here.
</div>

## A maths block

$$
> A line that looks like a blockquote — is FLAGME.
$$
