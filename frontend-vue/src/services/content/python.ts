import type { TutorialSection } from '@/types'

export const PYTHON_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome!

This is a programming tutorial that aims to teach you how to read and write code in the most widely used programming languages: Python, Ruby, C, C++, C#, Java, Scala, Kotlin, Groovy, JavaScript, TypeScript, Go, Nim, Rust, etc.

Most of the widely used languages look and behave very similarly. They are all [imperative languages](https://en.wikipedia.org/wiki/Imperative_programming). They are so similar that if you know one, you almost know them all.

Throughout the tutorial you'll see short code snippets illustrated like this: \`nr: 1 + 2\`. Some snippets have a green Run button with a little arrow like ➤, for example: \`1 + 2\`. Click the Run button with the arrow ➤ to evaluate it in the REPL (read-evaluate-print loop) docked to the right side or bottom of the page.

You'll see groups of snippets like this:

\`\`\`python
# title: Warm-up: Hello and Variables
# description: Run these in order to see how the REPL keeps state between snippets.
print('Hello from a grouped snippet!')
---
x = 41
---
x + 1
\`\`\`

\`\`\`python
# title: A one-line summation expression
sum([1, 2, 3])
\`\`\`

You'll also see editable code blocks like this:

\`\`\`python
def say_hello(name):
  print(f"Hello {name}")

say_hello("Joe")
\`\`\`

Code blocks have a green Run button in the top-right. Click it to send the whole block to the REPL.

You can edit the code in the code blocks by clicking on the code and typing. When the cursor is blinking inside a code block, you can press \`nr: ctrl+enter\` to run (hold Control, press Enter) the code.

Let's begin.`,
    nextSection: 'comments',
  },
  {
    id: 'comments',
    title: 'Comments',
    order: 2,
    content: `* lines that start with \`nr: #\` are comments
  * for example: \`nr: # this is a comment\`
* comments are used to explain what the code does
* comments are ignored by the Python interpreter

\`\`\`python
# this line is a comment
# everything to the right of a # symbol is a comment and is ignored by the Python interpreter

# Let's see what happens when we run some actual code with comments
message = "Hello from Python!"  # this comment explains what this line does
print(message)  # this comment explains we're printing the message
\`\`\``,
    previousSection: 'introduction',
    nextSection: 'values',
  },
  {
    id: 'values',
    title: 'Values',
    order: 3,
    content: `Values are the basic pieces of data that programs read, store, and manipulate. In Python, the most common kinds of values are numbers, strings, booleans, lists, dictionaries (maps), and objects (instances of classes).

These various kinds of values are also called "types". We will learn about sets and types in detail in the [Sets and Types](/section/types) section.

### Numbers

- Numbers are used for counting things, doing math, measuring quantities like time, distance, or cost.
- There are two main kinds of numeric representation:
  - \`nr: int\` are whole numbers: \`nr: ..., -2, -1, 0, 1, 2, ...\`
  - \`nr: float\` are numbers with a fractional part: \`nr: 3.14\`, \`nr: -0.5\`, \`nr: 1.0\`
- You can use underscores instead of commas to make big numbers more readable.
  - Write 1,000,000 as \`nr: 1_000_000\` or \`nr: 1000000\`

\`\`\`python
# title: Numbers — literal values
# description: Evaluate some integer and float literals.
42
---
1_000_000
---
3.141592653589793
---
-7
\`\`\`

### Strings

- What they are used for: representing text like names, messages, file paths, and any human-readable data.
- Features: written with quotes, can include spaces and punctuation, support Unicode.

\`\`\`python
# title: Strings — literal values
# description: Evaluate some string literals.
"Hello, world!"
---
'Python is fun'
---
"😀 emojis are text, too"
\`\`\`

### Booleans (bool)

- What they are used for: representing truth values for decisions, conditions, and flags.
- Values: \`nr: True\` and \`nr: False\`.

\`\`\`python
# title: Booleans — True/False
# description: Evaluate the two boolean values.
True
---
False
\`\`\`

### Lists (list)

- What they are used for: ordered collections of items; great for sequences like to-do items, scores, or search results.
- Features: can hold values of any type, can be empty, can be nested.

\`\`\`python
# title: Lists — literal values
# description: Evaluate list literals of different shapes.
[1, 3, 5, 7, 9]
---
["apples", "bananas", "cherries"]
---
[1000, "cookies", True]
---
[]  # an empty list
\`\`\`

### Dictionaries (dict)

- What they are used for: mapping keys to values; great for lookups, configurations, and records.
- Features: keys must be unique; common keys are strings or numbers.

\`\`\`python
# title: Dictionaries — literal values
# description: Evaluate dictionary (map) literals.
{1: "one", 2: "two", 3: "three"}
---
{"Jack": "Cookies", "Jill": "Ice Cream", "Phil": "Asparagus"}
\`\`\`

### Objects (instances of classes)

- What they are used for: representing real-world things with data (attributes) and behavior (methods), like a \`Dog\`, \`Car\`, or \`BankAccount\`.
- Example: creating an instance of a simple class.

\`\`\`python
# title: Objects — class instances
# description: Define a simple class, create an instance, and evaluate it.
class Dog:
  def __init__(self, name):
    self.name = name
---
my_dog = Dog("Max")
---
my_dog
\`\`\`

You will use these values inside expressions, assignments, function calls, and conditionals in the rest of this tutorial.
`,
    previousSection: 'comments',
    nextSection: 'operators',
  },
  {
    id: 'operators',
    title: 'Operators',
    order: 4,
    content: `Operators combine or transform values to produce new values. You will use them constantly with numbers, strings, lists, and booleans.

There are two primary shapes of operator:

- Binary operators: take two inputs — \`nr: A <operator> B\`
- Unary operators: take one input — \`nr: <operator> A\`

## Binary operators

### Arithmetic (numbers)

- Addition: \`nr: +\`
  - Adds two numbers: \`nr: 3 + 5\` evaluates to \`nr: 8\`
- Subtraction: \`nr: -\`
  - Subtracts one number from another: \`nr: 10 - 3\` evaluates to \`nr: 7\`
- Multiplication: \`nr: *\`
  - Repeats addition: \`nr: 4 * 3\` means \`nr: 4 + 4 + 4\` which evaluates to \`nr: 12\`
- Division (float): \`nr: /\`
  - Splits into equal parts: \`nr: 10 / 2\` evaluates to \`nr: 5.0\` (always a decimal)
- Remainder (modulo): \`nr: %\`
  - What's left after division: \`nr: 10 % 3\` evaluates to \`nr: 1\` (10 ÷ 3 = 3 remainder 1)
- Exponent: \`nr: **\`
  - Repeated multiplication: \`nr: 2 ** 3\` means \`nr: 2 * 2 * 2\` which evaluates to \`nr: 8\`

\`\`\`python
# title: Arithmetic (binary)
# description: Practice common arithmetic operations.
1 + 2
---
7 - 3
---
4 * 5
---
9 / 2
---
9 % 2
---
2 ** 3
\`\`\`

### Comparison (booleans)

- Equal: \`nr: ==\`  |  Not equal: \`nr: !=\`
  - Tests if values are the same: \`nr: 5 == 5\` evaluates to \`nr: True\`, \`nr: 5 != 3\` evaluates to \`nr: True\`
- Less than / less than or equal: \`nr: <\`, \`nr: <=\`
  - Compares size: \`nr: 3 < 5\` evaluates to \`nr: True\`, \`nr: 5 <= 5\` evaluates to \`nr: True\`
- Greater than / greater than or equal: \`nr: >\`, \`nr: >=\`
  - Compares size: \`nr: 7 > 3\` evaluates to \`nr: True\`, \`nr: 5 >= 5\` evaluates to \`nr: True\`

\`\`\`python
# title: Comparison (binary)
# description: Compare values to get boolean results.
3 == 3
---
3 != 4
---
2 < 5
---
5 <= 5
---
7 > 1
---
7 >= 10
\`\`\`

### Logical (booleans)

- And: \`nr: and\`  |  Or: \`nr: or\`
  - \`nr: and\`: Both must be True: \`nr: True and False\` evaluates to \`nr: False\`
  - \`nr: or\`: At least one must be True: \`nr: True or False\` evaluates to \`nr: True\`
- Short-circuit: \`nr: A and B\` skips \`nr: B\` if \`nr: A\` is False; \`nr: A or B\` skips \`nr: B\` if \`nr: A\` is True.

\`\`\`python
# title: Logical (binary)
# description: Combine boolean values with and/or.
True and False
---
True or False
\`\`\`

### Sequence operations (strings and lists)

- Concatenation: \`nr: +\`
  - Joins sequences together: \`nr: "Hi" + "there"\` evaluates to \`nr: "Hithere"\`, \`nr: [1, 2] + [3]\` evaluates to \`nr: [1, 2, 3]\`
- Repetition: \`nr: *\`
  - Repeats a sequence: \`nr: "ha" * 3\` evaluates to \`nr: "hahaha"\`, \`nr: [0] * 4\` evaluates to \`nr: [0, 0, 0, 0]\`

\`\`\`python
# title: Sequence operations (binary)
# description: Concatenate and repeat strings/lists.
"Hi, " + "there"
---
"ha" * 3
---
[1, 2] + [3]
---
[0] * 4
\`\`\`

## Unary operators

- Numeric sign: \`nr: +a\` (unary plus), \`nr: -a\` (negation)
  - \`nr: +a\`: Makes a number positive (rarely needed): \`nr: +5\` evaluates to \`nr: 5\`
  - \`nr: -a\`: Flips the sign: \`nr: -5\` evaluates to \`nr: -5\`, \`nr: -(-3)\` evaluates to \`nr: 3\`
- Logical negation: \`nr: not a\`
  - Flips True/False: \`nr: not True\` evaluates to \`nr: False\`, \`nr: not False\` evaluates to \`nr: True\`

\`\`\`python
# title: Unary operators
# description: Apply operators that take a single input.
+5
---
-5
---
-(-3)
---
not True
---
not (2 < 3)
\`\`\`

## Precedence and grouping

- Parentheses \`nr: ( )\` change evaluation order.
  - Forces operations inside to happen first: \`nr: (1 + 2) * 3\` evaluates to \`nr: 9\` instead of \`nr: 7\`
- Precedence (high → low): \`nr: **\`, \`nr: * / // %\`, \`nr: + -\`, comparisons, \`nr: not\`, \`nr: and\`, \`nr: or\`.
  - Higher precedence operations happen first: \`nr: 1 + 2 * 3\` means \`nr: 1 + (2 * 3)\` which evaluates to \`nr: 7\`

\`\`\`python
# title: Precedence and grouping
# description: See how precedence and parentheses affect evaluation.
1 + 2 * 3
---
(1 + 2) * 3
\`\`\`

## Python-specific extra operators

These are very useful in Python but are not universal across all languages:

- Membership: \`nr: in\`, \`nr: not in\`
  - Tests if something is inside: \`nr: "py" in "python"\` evaluates to \`nr: True\`, \`nr: 3 in [1, 2, 3]\` evaluates to \`nr: True\`
- Identity: \`nr: is\`, \`nr: is not\`
  - Tests if two variables point to the exact same object: \`nr: a is b\` (stricter than \`nr: ==\`)
- Bitwise (integers): \`nr: &\`, \`nr: |\`, \`nr: ^\`, \`nr: <<\`, \`nr: >>\`, and unary \`nr: ~\`
  - Works with binary representation: \`nr: 5 & 3\` evaluates to \`nr: 1\`, \`nr: 8 >> 2\` evaluates to \`nr: 2\`
- Floor division: \`nr: //\`
  - Division that rounds down: \`nr: 10 // 3\` evaluates to \`nr: 3\` (not \`nr: 3.33...\`)
- Indexing and slicing: \`nr: seq[index]\`, \`nr: seq[start:stop:step]\`
  - Gets parts of sequences: \`nr: "hello"[1]\` evaluates to \`nr: "e"\`, \`nr: [1,2,3,4][1:3]\` evaluates to \`nr: [2, 3]\`
- Chained comparisons: \`nr: 1 < x < 5\`
  - Multiple comparisons at once: \`nr: 1 < 3 < 5\` evaluates to \`nr: True\` (means \`nr: 1 < 3 and 3 < 5\`)

\`\`\`python
# title: Python extras — membership, identity, bitwise, floor division, slicing
# description: Explore Python-specific operators and forms.
a = [1, 2]
b = a
c = list(a)
---
"py" in "python"
---
3 in [1, 2, 3]
---
"x" not in "python"
---
a is b
---
a is c
---
a == c
---
5 & 3
---
5 | 2
---
5 ^ 1
---
5 << 1
---
5 >> 1
---
~5
---
9 // 2
---
[1,2,3,4][1:3]
---
"python"[::-1]
---
x = 3
---
1 < x < 5
---
5 < x < 7
\`\`\`

You now know the common operators (binary and unary) and where Python adds extras; next you will use them with variables and assignments.
`,
    previousSection: 'values',
    nextSection: 'variables',
  },
  {
    id: 'variables',
    title: 'Variables and Assignment',
    order: 6,
    content: `A variable is a name that points at a particular value. For example:

<div>
    <svg width="510" height="90" viewBox="0 0 510 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="510" height="90" fill="#fff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="20" y="55" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#111827">what_i_ate_for_breakfast</text>
      <text x="410" y="55" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#111827">"cereal"</text>
      <path d="M250,50 H390" stroke="#111827" stroke-width="2"/>
      <path d="M390,45 L400,50 L390,55" fill="none" stroke="#111827" stroke-width="2"/>
    </svg>
</div>

<div>
    <svg width="510" height="90" viewBox="0 0 510 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="510" height="90" fill="#fff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="20" y="55" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#111827">my_current_age</text>
      <text x="410" y="55" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#111827">10.5</text>
      <path d="M170,50 H390" stroke="#111827" stroke-width="2"/>
      <path d="M390,45 L400,50 L390,55" fill="none" stroke="#111827" stroke-width="2"/>
    </svg>
</div>

We name a variable with letters, numbers, and the underscore character, for example:

* \`nr: firstName\`
* \`nr: last_name\`
* \`nr: myAge\`
* \`nr: what_i_ate_for_breakfast\`

We can't use spaces in variable names.

In Python, you can create a new variable simply by assigning a value to it—no declaration is needed. This is different from languages like JavaScript and TypeScript, which require variables to be declared (with keywords like \`nr: let\`, \`nr: const\`, or \`nr: var\`) before or during their first assignment.

A variable can only point at one value at a time; however, we can change the value that a variable points at.

<div>
  <img src="/whatiateforbreakfast_reassignment.png" alt="Variable reassignment example showing what_i_ate_for_breakfast changing from 'cereal' to 'toast'" style="max-width: 100%; height: auto; margin: 10px 0;" />
</div>

<div>
  <img src="/mycurrentage_reassignment.png" alt="Variable reassignment example showing my_current_age changing from 10 to 10.5" style="max-width: 100%; height: auto; margin: 10px 0;" />
</div>

When we make a variable point at a value, we say that we are assigning a value to a variable; this process is called assignment.

## Assignment

We use the equal sign, \`nr: =\` , to make a variable point at a value, like this: \`my_age_last_year = 25\`

This makes the \`nr: my_age_last_year\` variable point to the value \`nr: 25\`.

The equal sign, \`nr: =\` , is called the assignment operator.

When we use the assignment operator, \`nr: =\` , to make a variable point at a value, we call that an assignment expression.

These are all assignment expressions:

* \`nr: my_age = 10\`
* \`nr: my_first_word = "cookie"\`
* \`nr: number_of_cookies_i_want_to_eat = 100\`

When we use the name of a variable by itself, without the assignment operator, we are reading the value that the variable points at and doing something with that value.

For example, this is a variable assignment:

\`\`\`python
# title: Variable assignment
age = 25
---
name = "Alice"
\`\`\`

For example, we can assign our age to the \`nr: current_age\` variable, and then calculate our age next year by adding 1 to the value stored in the \`nr: current_age\` variable:

\`\`\`python
# title: Working with variables step by step
current_age = 10
---
age_next_year = current_age + 1
---
age_next_year
\`\`\`

Finally, we can change the value that a variable points at by assigning a new value to the variable:

\`\`\`python
# title: Variable reassignment example
my_age = 10
print(f"my_age -> {my_age}")   # this prints 10
---
my_age = 11
print(f"my_age -> {my_age}")   # this prints 11
\`\`\`

`,
    previousSection: 'operators',
    nextSection: 'expressions',
  },
  {
    id: 'expressions',
    title: 'Expressions',
    order: 7,
    content: `So far, we have seen several different kinds of expression:

* value literal expressions
   * \`123\` - integer literal expressions
   * \`3.14159\` - floating point literal expressions
   * \`True\` - boolean literal expressions
   * \`"Max"\` - string literal expressions
   * \`[1, 2, 3, 1, 2, 3]\` - list literal expressions
   * \`{1: "one", 2: "two"}\` - dictionary literal expressions
* assignment expressions
   * \`my_age = 25\`
   * \`what_i_ate_for_breakfast = "cereal"\`
* variable evaluation expressions
   * \`my_age\`
   * \`what_i_ate_for_breakfast\`
* math expressions
   * \`1 + 2\`
   * \`3 * 4\`
   * \`10 / 2\`
   * \`5 - 3\`

An expression is anything that can be evaluated to produce a value.

For example, each of these expressions produces a value:
* \`1 + 2\` -> \`nr: 3\`
* \`3 * 4\` -> \`nr: 12\`
* \`10 / 2\` -> \`nr: 5\`
* \`5 - 3\` -> \`nr: 2\`

When we evaluate an expression, we compute the value that the expression represents, and then we use that computed value instead of the complex expression that produced it.

For example, when we evaluate the expression \`1 + 2\`, we compute the value \`3\`, because math expressions evaluate to the number that the math produces.

When we evaluate the expression \`my_age\`, we look up whatever value is currently stored in the variable named \`my_age\`, because variable evaluation expressions evaluate to the value that the variable currently points at.

When we evaluate the expression \`5\`, we know that evaluates to the number \`5\`, because literal expressions evaluate to themselves.

Different programming languages support different kinds of expressions, and each kind of expression has a different way of being evaluated.

Learning a programming language is all about learning and remembering how each different kind of expression is interpreted and evaluated.

The common expression types across every popular programming language are:

* value literal expressions
* assignment expressions
* variable evaluation expressions
* function definition expressions
* function invocation expressions
* conditional expressions
* loop expressions

These common kinds of expression are what we are focusing on in this tutorial, because every language has them, so if you know what an assignment expression looks like in python, then you know what it looks like in most every language.

### Comparison expressions

Comparison expressions evaluate to a boolean (\`nr: True\` or \`nr: False\`).

Try these:

\`\`\`python
1 == 1
1 != 2
3 < 5
5 <= 5
7 > 2
2 >= 9
# chained comparisons (Python feature):
1 < 3 < 5
5 < 3 < 7
\`\`\`

### Boolean logic expressions

Use \`nr: and\`, \`nr: or\`, and \`nr: not\` to combine or negate boolean values.

\`\`\`python
True and True
True and False
True or False
False or False
not True
not (1 < 2)
\`\`\`

Short-circuiting: in \`nr: A and B\`, if \`nr: A\` is False, Python does not evaluate \`nr: B\`. In \`nr: A or B\`, if \`nr: A\` is True, Python does not evaluate \`nr: B\`.

### Grouping and operator precedence

Parentheses \`nr: ( )\` change evaluation order. Arithmetic has the usual precedence (\`nr: * / // %\` before \`nr: + -\`), then comparisons, then \`nr: not\`, then \`nr: and\`, then \`nr: or\`.

\`\`\`python
1 + 2 * 3
(1 + 2) * 3
10 - 4 - 1
10 - (4 - 1)
(2 < 3) and (3 < 5)
\`\`\`

### String expressions

\`nr: +\` concatenates strings; \`nr: *\` repeats them.

\`\`\`python
"Hello, " + "world!"
"ha" * 3
name = "Sam"
"Hello, " + name
f"Hello, {name}!"  # f-strings interpolate values
\`\`\`

### List expressions

Lists also support concatenation and repetition.

\`\`\`python
[1, 2] + [3, 4]
[0] * 5
len([1, 2, 3])
\`\`\`

### Indexing and slicing

Use square brackets to get elements or slices from strings and lists.

\`\`\`python
letters = ["a", "b", "c", "d", "e"]
letters[0]
letters[-1]
letters[1:4]
letters[:3]
letters[::2]

text = "python"
text[0]
text[-1]
text[1:4]
text[::-1]
\`\`\`

### Membership

Use \`nr: in\` and \`nr: not in\` to test membership.

\`\`\`python
3 in [1, 2, 3]
"py" in "python"
9 not in [1, 2, 3]
"x" not in "python"
\`\`\`

These forms are the building blocks you will combine inside conditionals, loops, and function calls in the next sections.
`,
    previousSection: 'variables',
    nextSection: 'functions',
  },
  {
    id: 'functions',
    title: 'Functions',
    order: 8,
    content: `A function is like a recipe. A recipe has a name and a list of instructions to follow.

For example, here is a recipe for making a peanut butter sandwich:

**Peanut Butter Sandwich**

1. Get two pieces of bread
2. Get a jar of peanut butter
3. Get a knife
4. Open the jar of peanut butter
5. Use the knife to spread peanut butter on one side of one piece of bread
6. Use the knife to spread peanut butter on one side of the other piece of bread
7. Put the two pieces of toast together, with the peanut butter covered sides facing one another
8. Put the knife in the sink
9. Put the lid back on the peanut butter jar
10. Place the peanut butter sandwich on a plate

The recipe has a name: Peanut Butter Sandwich

The recipe has a list of instructions to follow in order.

The list of instructions is just an expression sequence, so a function is just an expression sequence that has a name.

There are 2 simple rules that you must follow when naming a function:

1. The name can't have any spaces or hyphens (dashes) in it. Just replace spaces and hyphens with underscores.
   * Peanut Butter Sandwich → Peanut_Butter_Sandwich
   * Peanut-Butter-Sandwich → Peanut_Butter_Sandwich
2. The name can't begin with a number. It must begin with a letter or an underscore.
   * These are bad names; they won't work, because they start with a number:
      * 1dog
      * 2_apples
   * These are good names; these will work, because they do not start with a number:
      * one_dog
      * two_apples
      * _20_people
      * book_x5

In Python, we create a function by using the special keyword \`nr: def\`, followed by the name of the function, followed by parenthesis at the end of the function name, followed by a colon (a colon is this character: \`nr: :\` ), like this:

def make_peanut_butter_sandwich():
  pass

A function also has a body, which is just the list of instructions we want the function to evaluate. The function body is an expression sequence. For example:

def make_peanut_butter_sandwich():
  toast_the_bread()
  spread_peanut_butter_onto_the_toast()
  smash_the_pieces_of_toast_with_peanut_butter_together()
  clean_up()
  put_the_sandwich_on_a_plate()

In addition to a name and a body, a function may have parameters. A function parameter is like a variable that gets set every time the function is called or invoked. A function parameter is just a variable that the function expects to be supplied when the function is called. Parameters are defined inside the parenthesis that follow the name of the function, and they are separated with a comma.

The following example function has two parameters: \`kind_of_bread\` , and \`quantity\`

def make_peanut_butter_sandwich(kind_of_bread, quantity):
  for i in range(quantity):
    toast_the_bread(kind_of_bread)
    spread_peanut_butter_onto_the_toast()
    smash_the_pieces_of_toast_with_peanut_butter_together()
    clean_up()
    put_the_sandwich_on_a_plate()

This function has one parameter: \`age\`

def print_my_age(age):
  print("I am", age, "years old")

This function has no parameters:

def print_hello():
  print("Hello")`,
    previousSection: 'expressions',
    nextSection: 'function-invocation',
  },
  {
    id: 'function-invocation',
    title: 'Function Invocation',
    order: 9,
    content: `You can use a function by calling it, or invoking it. Calling a function is the same thing as invoking it.

A function may be called, or invoked, by typing the name of the function, followed by parenthesis. If the function was defined to accept parameters, then you must supply values for those parameters.

For example, if we have the following function without any parameters:

def print_hello():
  print("Hello")

we can call it, or invoke it, by typing its name, followed by an empty set of parenthesis, like this:

print_hello()

When we call this function in an interactive interpreter session, here is what happens:

❯ python
Python 3.13.2 (main, Feb 12 2025, 14:51:17) [Clang 19.1.6 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def print_hello():
...   print("Hello")
...
>>> print_hello()
Hello

If we have the following function with one parameter:

def print_my_age(age):
  print("I am", age, "years old")

we can call it by typing its name, followed by an open paren, followed by an age, followed by a close paren, like this:

print_my_age(8)

When we call this function in an interactive interpreter session, here is what happens:

❯ python
Python 3.13.2 (main, Feb 12 2025, 14:51:17) [Clang 19.1.6 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def print_my_age(age):
...   print("I am", age, "years old")
...
>>> print_my_age(8)
I am 8 years old

If we have the following function with two parameters:

def print_introduction(name, age):
  print("Hello, my name is", name, "and I am", age, "years old")

we can call it by typing its name, followed by an open paren, followed by a name, followed by an age, followed by a close paren, like this:

print_introduction("Jim", 9)

When we call this function in an interactive interpreter session, here is what happens:

❯ python
Python 3.13.2 (main, Feb 12 2025, 14:51:17) [Clang 19.1.6 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def print_introduction(name, age):
...   print("Hello, my name is", name, "and I am", age, "years old")
...
>>> print_introduction("Jim", 9)
Hello, my name is Jim and I am 9 years old

In addition to accepting input parameters, functions can also return a value to the caller of the function.

For example, if we have a function like:

def add_five(value):
  return value + 5

and we call it like this:

three_plus_five = add_five(3)

then the value returned by the function call \`add_five(3)\` is assigned to the variable named \`three_plus_five\` , which means that after the assignment expression has been evaluated, the variable \`three_plus_five\` contains the value \`8\`.

We can see that in the following interactive interpreter session:

>>> def add_five(value):
...   return value + 5
...
>>> three_plus_five = add_five(3)
>>> three_plus_five
8`,
    previousSection: 'functions',
    nextSection: 'conditionals',
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 10,
    content: `The primary conditional or branching expression is the \`if\` / \`elif\` / \`else\` expression.

There are three variations:

* \`if\`
   * The \`if\` keyword is always followed by a boolean expression - an expression that evaluates to \`True\` or \`False\`
   * When the boolean expression evaluates to \`True\`, the body of the \`if\` expression is evaluated; otherwise the body is skipped.
   * if i_am_hungry:
       print("I'm starving!")
* \`if\` / \`else\`
   * if i_am_hungry:
       print("I'm starving!")
     else:
       print("I am full.")
* \`if\` / \`elif\` / \`else\`
   * if age < 5:
       print("You are younger than five years old.")
     elif age < 10:
       print("You are five to nine years old.")
     else:
       print("You are ten or older")

In each case, the \`if\` expression is always followed by an expression that evaluates to a boolean value.`,
    previousSection: 'function-invocation',
    nextSection: 'types',
  },
  {
    id: 'types',
    title: 'Sets and Types',
    order: 11,
    content: `## Sets
A set is a collection of unique values, like the list of all the words in the dictionary. Each word appears only once.

In other words, a set is a group of values where every value is different; there cannot be two of anything.

### This is a set of three numbers:

* \`nr: [ 1, 2, 3 ]\`

You can visualize a set as a circle containing its unique elements. For example, the following SVG shows a set with the numbers 1, 2, and 3:

<div style="display: flex; justify-content: center; margin: 1em 0;">
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#4CAF50" stroke="#000" stroke-width="2"/>
    <text x="90" y="80" fill="#FFFFFF" font-size="18">1</text>
    <text x="110" y="100" fill="#FFFFFF" font-size="18">2</text>
    <text x="90" y="120" fill="#FFFFFF" font-size="18">3</text>
  </svg>
</div>


### This is a set of two names:

* \`nr: [ "Jack", "Jill" ]\`

<div style="display: flex; justify-content: center; margin: 1em 0;">
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#9C27B0" stroke="#000" stroke-width="2"/>
    <text x="80" y="100" fill="#FFFFFF" font-size="18">"Jack"</text>
    <text x="90" y="120" fill="#FFFFFF" font-size="18">"Jill"</text>
  </svg>
</div>


### This is a set of different kinds of things:

* \`nr: [ 1, 3.141592653589793, "Steve", True ]\`

<div style="display: flex; justify-content: center; margin: 1em 0;">
   <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
   <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
   <text x="85" y="90" fill="#FFFFFF" font-size="16">1</text>
   <text x="25" y="110" fill="#FFFFFF" font-size="16">3.141592653589793</text>
   <text x="90" y="130" fill="#FFFFFF" font-size="16">"Steve"</text>
   <text x="90" y="150" fill="#FFFFFF" font-size="16">True</text>
   </svg>
</div>

### This is **NOT** a set (because \`nr: 1\` is repeated):

* \`nr: [ 1, 1, 3.141592653589793 ]\`

<div style="display: flex; justify-content: center; margin: 1em 0;">
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#F44336" stroke="#000" stroke-width="2"/>
    <text x="85" y="70" fill="#FFFFFF" font-size="16">1</text>
    <text x="85" y="90" fill="#FFFFFF" font-size="16">1</text>
    <text x="25" y="110" fill="#FFFFFF" font-size="16">3.141592653589793</text>
  </svg>
</div>

## Types

A type is a set of values that we give a name to.

We can name a type anything we want. For example:

* We could call the set \`nr: [1,2,3]\` **TinyNumber**
   * The type **TinyNumber** is the set of values \`nr: [1,2,3]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#4CAF50" stroke="#000" stroke-width="2"/>
  <path id="tinyNumberPath" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#tinyNumberPath" startOffset="50%" text-anchor="middle">TinyNumber</textPath>
  </text>
  <text x="90" y="90" fill="#FFFFFF" font-size="18">1</text>
  <text x="110" y="110" fill="#FFFFFF" font-size="18">2</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">3</text>
</svg>

* We could give the name **DogName** to the set \`nr: ["Max", "Ace", "Tiny"]\`
   * The type **DogName** is the set of values \`nr: ["Max", "Ace", "Tiny"]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
  <path id="dogNamePath" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#dogNamePath" startOffset="50%" text-anchor="middle">DogName</textPath>
  </text>
  <text x="80" y="90" fill="#FFFFFF" font-size="18">"Max"</text>
  <text x="85" y="110" fill="#FFFFFF" font-size="18">"Ace"</text>
  <text x="85" y="130" fill="#FFFFFF" font-size="18">"Tiny"</text>
</svg>


* We could name the set \`nr: [99, 100, 101]\` **AgeOfAnOldPerson**
   * The type **AgeOfAnOldPerson** is the set of values \`nr: [99, 100, 101]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#9C27B0" stroke="#000" stroke-width="2"/>
  <path id="ageOfAnOldPersonPath" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#ageOfAnOldPersonPath" startOffset="50%" text-anchor="middle">AgeOfAnOldPerson</textPath>
  </text>
  <text x="85" y="90" fill="#FFFFFF" font-size="18">99</text>
  <text x="95" y="110" fill="#FFFFFF" font-size="18">100</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">101</text>
</svg>

* We could say **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`
   * The type **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#F44336" stroke="#000" stroke-width="2"/>
  <path id="smallOddNumberPath" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#smallOddNumberPath" startOffset="50%" text-anchor="middle">SmallOddNumber</textPath>
  </text>
  <text x="85" y="80" fill="#FFFFFF" font-size="18">1</text>
  <text x="95" y="100" fill="#FFFFFF" font-size="18">3</text>
  <text x="90" y="120" fill="#FFFFFF" font-size="18">5</text>
  <text x="85" y="140" fill="#FFFFFF" font-size="18">7</text>
  <text x="90" y="160" fill="#FFFFFF" font-size="18">9</text>
</svg>

* Some types are sets with an infinite number of values. For example, the type **WholeNumber** is the set of all whole numbers.

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#4CAF50" stroke="#000" stroke-width="2"/>
  <path id="intPath" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#intPath" startOffset="50%" text-anchor="middle">WholeNumber</textPath>
  </text>
  <text x="25" y="100" fill="#FFFFFF" font-size="18">…, -2, -1, 0, 1, 2, …</text>
</svg>

## Typed Values

If a value is in the set named by a particular type name, then we say the value is "of that type", or we say that the value "has that type".

* Since \`nr: 1\` is in the **TinyNumber** set:
   * we say, \`nr: 1\` is of type TinyNumber
   * or we say, \`nr: 1\` has the type TinyNumber
* Since \`nr: 1\` is in the **SmallOddNumber** set
   * we say, \`nr: 1\` is of type SmallOddNumber
   * or we say, \`nr: 1\` has the type SmallOddNumber
* Since \`nr: 1\` is in the **WholeNumber** set
   * we say, \`nr: 1\` is of type WholeNumber
   * or we say, \`nr: 1\` has the type WholeNumber
* Since \`nr: 99\` is in the **AgeOfAnOldPerson** set
   * we say, \`nr: 99\` is of type AgeOfAnOldPerson
   * or we say, \`nr: 99\` has the type AgeOfAnOldPerson
* Since \`nr: "Max"\` is in the **DogName** set
   * we say, \`nr: "Max"\` is of type DogName
   * or we say \`nr: "Max"\` has the type DogName

In Python, there is a type called \`nr: int\` that is the set of all whole numbers:

* \`nr: [..., -3, -2, -1, 0, 1, 2, 3, ...]\`

There is a type called \`nr: float\` that is the set of all numbers:

* \`nr: [..., -10.1, -2.0, -1.6, 0.0, 0.5, 1.0, 2.8, 3.1, 1000.0, ...]\`

Python has a bunch of built in types:

* \`nr: bool\` - boolean
* \`nr: int\` - integers (numbers without a decimal point)
* \`nr: float\` - floating point numbers (numbers with a decimal point)
* \`nr: str\` - strings
* \`nr: set\` - sets
* \`nr: list\` - lists
* \`nr: dict\` - dictionary (also called a map)
* and many more
`,
    previousSection: 'conditionals',
    nextSection: 'next-steps',
  },
]
