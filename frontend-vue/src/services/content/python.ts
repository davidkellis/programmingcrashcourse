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
  print(f"Hello \{name}")

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
print(f"my_age -> \{my_age}")   # this prints 10
---
my_age = 11
print(f"my_age -> \{my_age}")   # this prints 11
\`\`\`

`,
    previousSection: 'operators',
    nextSection: 'expressions',
  },
  {
    id: 'expressions',
    title: 'Expressions',
    order: 7,
    content: `In Python, an expression is anything you can evaluate to get a value. This section surveys the major expression shapes you'll use every day.

The big categories we'll cover are:

- value literal expressions
- variable evaluation and variable assignment
- binary and unary operator expressions
- sequencing of expressions
- function definitions and function invocations
- conditional branching expressions
- looping expressions

### 1) Value literal expressions

- A literal writes the value directly in your code.
- Examples: numbers, strings, booleans, and collection literals like lists, dictionaries, and tuples.

\`\`\`python
# title: Value literals — numbers, strings, booleans
# description: Literals evaluate to themselves.
42
---
3.14159
---
"Max"
---
True
---
False
\`\`\`

\`\`\`python
# title: Value literals — collections
# description: Literals for list, dict, and tuple.
[1, 2, 3]
---
{"a": 1, "b": 2}
---
(1, 2, 3)
\`\`\`

### 2) Variable evaluation and assignment

- Evaluating a variable name (like \`nr: x\`) yields the value it currently points to.
- Assignment uses \`nr: =\` to make a name point at a value; reassigning updates what the name points at.

\`\`\`python
# title: Variables — evaluation vs assignment
# description: Read a name to get its value; use = to change it.
pet = "dog"
---
pet
---
pet = "cat"
---
pet
\`\`\`

### 3) Binary and unary operator expressions

- Binary operators take two inputs: \`nr: A <op> B\`.
- Unary operators take a single input.
- Useful families include arithmetic, comparison, logical, and sequence ops.

\`\`\`python
# title: Binary operators — arithmetic and comparison
# description: Combine two values to produce a new one.
1 + 2
---
9 // 4
---
9 % 4
---
2 ** 5
---
3 < 5
---
3 == 3
\`\`\`

\`\`\`python
# title: Binary operators — sequence and membership
# description: Concatenate, repeat, or test for inclusion.
"Hi, " + "there"
---
"ha" * 3
---
[1, 2] + [3]
---
"py" in "python"
---
3 in [1, 2, 3]
\`\`\`

\`\`\`python
# title: Unary operators — sign and logical negation
# description: Operate on a single value.
-5
---
+5
---
not True
---
not (2 < 1)
\`\`\`

### 4) Sequencing of expressions

- Lines run top-to-bottom; later expressions see the effects of earlier ones.

\`\`\`python
# title: Sequencing — executed top to bottom
# description: Each line runs after the previous one; names keep their values.
x = 1
---
x = x + 2
---
x
---
y = x * 3
---
y
\`\`\`

### 5) Function definitions

- \`nr: def\` creates (binds) a new function object to a name.
- \`nr: lambda\` is a compact way to create a function value inline.

\`\`\`python
# title: Function definitions — def and lambda
# description: Creating functions produces function values.
def square(n):
  return n * n
---
square  # look at the function object
---
double = lambda x: x * 2
---
double
\`\`\`

### 6) Function invocations

- Use parentheses \`nr: ( )\` to call a function; arguments go inside.
- A call expression evaluates to the function's return value.

\`\`\`python
# title: Function invocations — calling functions
# description: Parentheses perform a call; the result is the return value.
def square(n):
  return n * n
---
square(6)
---
len([1, 2, 3])
---
abs(-7)
\`\`\`

### 7) Conditional branching expressions

- \`nr: if\` / \`nr: elif\` / \`nr: else\` chooses which block to run based on a condition.
- The conditional expression \`nr: A if cond else B\` picks one of two values.

\`\`\`python
# title: Conditional branching — if/elif/else
# description: Only the first matching block runs.
age = 8
---
if age < 5:
  print("toddler")
elif age < 10:
  print("kid")
else:
  print("older")
\`\`\`

\`\`\`python
# title: Conditional expression — a if cond else b
# description: Picks one of two values.
age = 8
---
"kid" if age < 10 else "teen"
---
"even" if (6 % 2 == 0) else "odd"
\`\`\`

### 8) Looping expressions

- \`nr: for\` loops over a sequence; \`nr: while\` repeats while a condition is true.
- Comprehensions are expressions that loop to build new values.

\`\`\`python
# title: Looping — for and while
# description: Repeat work while a condition holds or over a sequence.
for i in range(3):
  print(i)
---
n = 3
while n > 0:
  print(n)
  n -= 1
\`\`\`

\`\`\`python
# title: Looping — comprehension expressions
# description: Loop to build new values.
[x * x for x in range(6)]
---
[x for x in range(10) if x % 2 == 0]
---
{k: k * k for k in range(4)}
\`\`\`

You will combine these forms constantly: define names, compute with operators, branch and loop, and call functions. As you continue, try running the groups above with the Run buttons to see how the REPL preserves state across snippets within and across groups.
`,
    previousSection: 'variables',
    nextSection: 'functions',
  },
  {
    id: 'functions',
    title: 'Functions',
    order: 8,
    content: `A function is a sequence of expressions that has a name. It can accept input values as arguments and can return a value.

It's kind of like a recipe: it has a name, it has a list of instructions to follow in order, and you give it ingredients (i.e. input arguments) in order to use it.

For example, a recipe for making a sandwich is:

<div>
  <img src="/make_a_sandwich_function.png" alt="Function for making a sandwich" style="max-width: 100%; height: auto; margin: 10px 0;" />
</div>

Then, to use the recipe to make a peanut butter sandwich, you would follow the instructions in order, using peanut butter to "fill in the blank":

> Make a <u><strong>peanut butter</strong></u> sandwich:
>
> 1. Get 2 pieces of bread.
> 2. Open a jar of <u><strong>peanut butter</strong></u>.
> 3. Use a knife to spread <u><strong>peanut butter</strong></u> onto the two pieces of bread.
> 4. Put the two pieces of bread together.
> 5. Congratulations! You built a <u><strong>peanut butter</strong></u> sandwich! Eat it!

To make a ham sandwich, you would use ham instead of peanut butter:

> Make a <u><strong>ham</strong></u> sandwich:
>
> 1. Get 2 pieces of bread.
> 2. Open a jar of <u><strong>ham</strong></u>.
> 3. Use a knife to spread <u><strong>ham</strong></u> onto the two pieces of bread.
> 4. Put the two pieces of bread together.
> 5. Congratulations! You built a <u><strong>ham</strong></u> sandwich! Eat it!


In Python, we would write down our recipe as a function that looks like this:
\`\`\`python
def make_sandwich(filling):
  print(f"1. Get 2 pieces of bread.")
  print(f"2. Open a jar of \{filling}.")
  print(f"3. Use a knife to spread \{filling} onto the two pieces of bread.")
  print(f"4. Put the two pieces of bread together.")
  print(f"5. Congratulations! You built a \{filling} sandwich! Eat it!")
\`\`\`

Then, we would use the function to make a peanut butter sandwich and a ham sandwich:
\`\`\`python
print("Make a peanut butter sandwich:")
make_sandwich("peanut butter")

print("Make a ham sandwich:")
make_sandwich("ham")
\`\`\`


## Function Definition

Just as we did with the "Make a sandwich" recipe, we can write a function to do any kind of task.

A function definition creates a new function that does whatever you tell it to do, named with whatever name you give it.

You define a function with the \`nr: def\` keyword, followed by the function name, an optional list of parameters, a colon, a sequence of expressions, like this:

\`\`\`python
# title: Basic function definitions
# description: Creating functions with def syntax.
def function_name_goes_here(first_parameter, second_parameter):
    # sequence of expressions
    pass
---
# if you don't need any parameters, you can leave them off, like this:
def a_function_without_parameters():
    # sequence of expressions
    pass
---
def say_hi():
    print("Hello to you!")
---
def add_numbers(a, b):
    result = a + b
    print(f"\{a} + \{b} = \{result}")
    return result
---
def calculate_area(width, height):
    return width * height  # return statement sends value back
\`\`\`

### Parameters and Arguments

**Parameters** are like variables in the definition of a function that can be filled in with values when the function is used (i.e. called or invoked).

**Arguments** are the actual values that you give to the function when you use it (i.e. call or invoke it):

\`\`\`python
# title: Functions with parameters
# description: Parameters let functions work with different inputs.
def make_sandwich(bread_type, filling):
    print(f"Making a \${filling} sandwich on \${bread_type} bread")
    return f"\${bread_type} \${filling} sandwich"
---
def calculate_tip(bill_amount, tip_percentage):
    tip = bill_amount * (tip_percentage / 100.0)
    print(f"Bill: \${bill_amount}, Tip: \${tip:.2f}")
    return tip
---
make_sandwich("sourdough", "turkey")
---
calculate_tip(50, 18)
\`\`\`

### Function Names

Function names are named like variable names:
- Use letters, numbers, and underscores only
- Start with a letter or underscore (not a number)
- Use snake_case for multi-word names

\`\`\`python
# title: Function naming examples
# description: Good function names are descriptive and follow conventions.
def calculate_monthly_payment(principal, rate, months):
    monthly_rate = rate / 12.0
    payment = principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)
    return round(payment, 2)
---
def _helper_function():
    return "This is a private helper"
---
def user_age_in_days(birth_year):
    current_year = 2024
    return (current_year - birth_year) * 365
---
calculate_monthly_payment(20000, 0.05, 60)
---
user_age_in_days(1990)
\`\`\`

## Function Invocation

You use a function by **calling** it (also called **invoking** it).

You call a function by using the function name like you would a variable name and then you add parentheses at the end of the name, like \`nr: function_name_goes_here()\`.

Some functions expect arguments (input values) to be passed to them when they are called. You pass these arguments to the function inside the parentheses, separated by commas, like \`nr: function_name_goes_here(first_argument_value, second_argument_value, ...)\`.

\`\`\`python
# title: Calling functions
# description: Execute functions by name with arguments.
def greet_user(name):
    return f"Hello, \{name}!"
---
def multiply(x, y):
    return x * y
---
# Call with parentheses
greet_user("Alice")
---
multiply(7, 8)
---
# Store result in variables
greeting = greet_user("Bob")
print(greeting)
---
result = multiply(3, 4)
print(f"3 * 4 = \{result}")
\`\`\`

### Functions Without Parameters

Some functions don't need input to do their work:

\`\`\`python
# title: Parameter-free functions
# description: Functions that work without input.
import time
import random

def current_time():
    return time.strftime("%H:%M:%S")
---
def random_number():
    return random.randint(1, 100)
---
def system_info():
    import sys
    return f"Python version: \{sys.version_info.major}.\{sys.version_info.minor}"
---
current_time()
---
lucky_number = random_number()
print(f"Your lucky number: \{lucky_number}")
---
system_info()
\`\`\`

### Return Values

Functions can return a value back to the code that called it by using the \`nr: return\` keyword, like this: \`nr: return some_value_goes_here\`.

In Python, if you don't specify a return value, the function returns \`nr: None\`.

\`\`\`python
# title: Function return values
# description: Functions can produce output values.
def calculate_discount(price, discount_percent):
    discount = price * (discount_percent / 100.0)
    final_price = price - discount
    return final_price  # explicit return
---
def format_currency(amount):
    return f"\${amount:.2f}"  # return formatted string
---
def validate_password(password):
    if len(password) >= 8 and any(c.isupper() for c in password) and any(c.isdigit() for c in password):
        return "Strong password"
    elif len(password) >= 6:
        return "Medium strength"
    else:
        return "Weak password"
---
sale_price = calculate_discount(100, 20)
print(format_currency(sale_price))
---
print(validate_password("MyPass123"))
---
print(validate_password("abc"))
\`\`\`

### Practical Examples

Here are common function patterns you'll use:

\`\`\`python
# title: Practical function examples
# description: Real-world functions for common tasks.
def celsius_to_fahrenheit(celsius):
    return (celsius * 9.0 / 5.0) + 32
---
def word_count(text):
    return len(text.split())
---
def is_even(number):
    return number % 2 == 0
---
def format_name(first, last):
    return f"\{first.capitalize()} \{last.capitalize()}"
---
print(celsius_to_fahrenheit(25))
---
print(word_count("Python is a great programming language"))
---
print(is_even(42))
---
print(format_name("john", "DOE"))
\`\`\`

Like having a toolbox full of specialized tools, functions let you build reusable solutions once and use them throughout your program. Each function is like a reliable robot assistant that performs its specific task whenever called upon.`,
    previousSection: 'expressions',
    nextSection: 'conditionals',
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 9,
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
    previousSection: 'functions',
    nextSection: 'types',
  },
  {
    id: 'types',
    title: 'Sets and Types',
    order: 10,
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
