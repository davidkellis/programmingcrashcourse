import type { TutorialSection } from '@/types'

export const RUBY_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome!

This is a programming tutorial that aims to teach you how to read and write code in the most widely used programming languages: Python, Ruby, C, C++, C#, Java, Scala, Kotlin, Groovy, JavaScript, TypeScript, Go, Nim, Rust, etc.

Most of the widely used languages look and behave very similarly. They are all [imperative languages](https://en.wikipedia.org/wiki/Imperative_programming). They are so similar that if you know one, you almost know them all.

Throughout the tutorial you'll see short code snippets illustrated like this: \`nr: 1 + 2\`. Some snippets have a green Run button with a little arrow like ➤, for example: \`1 + 2\`. Click the Run button with the arrow ➤ to evaluate it in the REPL (read-evaluate-print loop) docked to the right side or bottom of the page.

You'll see groups of snippets like this:

\`\`\`ruby
# title: Warm-up: Hello and Variables
# description: Run these in order to see how the REPL keeps state between snippets.
puts 'Hello from a grouped snippet!'
---
x = 41
---
x + 1
\`\`\`

\`\`\`ruby
# title: A one-line summation expression
[1, 2, 3].sum
\`\`\`

You'll also see editable code blocks like this:

\`\`\`ruby
def say_hello(name)
  puts "Hello #{name}"
end

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
* comments are used to explain what the code does
* comments are ignored by the Ruby interpreter

\`\`\`ruby
# this line is a comment
# everything to the right of a # symbol is a comment and is ignored by the Ruby interpreter

# Let's see what happens when we run some actual code with comments
message = "Hello from Ruby!" # this comment explains what this line does
puts message # this comment explains we're printing the message
\`\`\``,
    previousSection: 'introduction',
    nextSection: 'values',
  },
  {
    id: 'values',
    title: 'Values',
    order: 3,
    content: `Values are the basic pieces of data that programs read, store, and manipulate. In Ruby, the most common kinds of values are numbers, strings, booleans, arrays, hashes (maps), and objects (instances of classes).

These various kinds of values are also called "types". We will learn about sets and types in detail in the [Sets and Types](/section/types) section.


### Numbers

- Numbers are used for counting things, doing math, measuring quantities like time, distance, or cost.
- There are two main kinds of numeric representation:
  - \`nr: Integer\` are whole numbers: \`nr: ..., -2, -1, 0, 1, 2, ...\`
  - \`nr: Float\` are numbers with a fractional part: \`nr: 3.14\`, \`nr: -0.5\`, \`nr: 1.0\`
- You can use underscores instead of commas to make big numbers more readable.
  - Write 1,000,000 as \`nr: 1_000_000\` or \`nr: 1000000\`

\`\`\`ruby
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

- What they are used for: representing text like names, messages, file paths, and any human‑readable data.
- Features: written with quotes, can include spaces and punctuation, support Unicode, support interpolation with \`nr: #{...}\`.

\`\`\`ruby
# title: Strings — literal values
# description: Evaluate some string literals.
"Hello, world!"
---
'Ruby is fun'
---
"😀 emojis are text, too"
\`\`\`

### Booleans (TrueClass/FalseClass)

- What they are used for: representing truth values for decisions, conditions, and flags.
- Values: \`nr: true\` and \`nr: false\`.

\`\`\`ruby
# title: Booleans — true/false
# description: Evaluate the two boolean values.
true
---
false
\`\`\`

### Arrays (Array)

- What they are used for: ordered collections of items; great for sequences like to‑do items, scores, or search results.
- Features: can hold values of any type, can be empty, can be nested.

\`\`\`ruby
# title: Arrays — literal values
# description: Evaluate array literals of different shapes.
[1, 3, 5, 7, 9]
---
["apples", "bananas", "cherries"]
---
[1000, "cookies", true]
---
[]  # an empty array
\`\`\`

### Hashes (Hash)

- What they are used for: mapping keys to values; great for lookups, configurations, and records.
- Features: keys must be unique; common keys are strings or numbers.

\`\`\`ruby
# title: Hashes — literal values
# description: Evaluate hash (map) literals.
{1 => "one", 2 => "two", 3 => "three"}
---
{"Jack" => "Cookies", "Jill" => "Ice Cream", "Phil" => "Asparagus"}
\`\`\`

### Objects (instances of classes)

- What they are used for: representing real‑world things with data (attributes) and behavior (methods), like a \`Dog\`, \`Car\`, or \`BankAccount\`.
- Example: creating an instance of a simple class.

\`\`\`ruby
# title: Objects — class instances
# description: Define a simple class, create an instance, and evaluate it.
class Dog
  def initialize(name)
    @name = name
  end
end
---
my_dog = Dog.new("Max")
---
my_dog
\`\`\`

You will use these values inside expressions, assignments, method calls, and conditionals in the rest of this tutorial.`,
    previousSection: 'comments',
    nextSection: 'operators',
  },
  {
    id: 'operators',
    title: 'Operators',
    order: 4,
    content: `Operators combine or transform values to produce new values. You will use them constantly with numbers, strings, arrays, and booleans.

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
- Division: \`nr: /\` (integer division when both operands are integers)
  - Splits into equal parts: \`nr: 9 / 2\` evaluates to \`nr: 4\` (integers), \`nr: 9.0 / 2\` evaluates to \`nr: 4.5\` (decimals)
- Remainder (modulo): \`nr: %\`
  - What's left after division: \`nr: 10 % 3\` evaluates to \`nr: 1\` (10 ÷ 3 = 3 remainder 1)
- Exponent: \`nr: **\`
  - Repeated multiplication: \`nr: 2 ** 3\` means \`nr: 2 * 2 * 2\` which evaluates to \`nr: 8\`

\`\`\`ruby
# title: Arithmetic (binary)
# description: Practice common arithmetic operations.
1 + 2
---
7 - 3
---
4 * 5
---
9 / 2      #=> 4 (integer division)
---
9.0 / 2    #=> 4.5
---
9 % 2
---
2 ** 3
\`\`\`

### Comparison (booleans)

- Equal: \`nr: ==\`  |  Not equal: \`nr: !=\`
  - Checks if values are the same: \`nr: 5 == 5\` evaluates to \`nr: true\`, \`nr: 3 != 4\` evaluates to \`nr: true\`
- Less than / less than or equal: \`nr: <\`, \`nr: <=\`
  - Compares size: \`nr: 3 < 5\` evaluates to \`nr: true\`, \`nr: 5 <= 5\` evaluates to \`nr: true\`
- Greater than / greater than or equal: \`nr: >\`, \`nr: >=\`
  - Compares size the other way: \`nr: 7 > 3\` evaluates to \`nr: true\`, \`nr: 4 >= 4\` evaluates to \`nr: true\`

\`\`\`ruby
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

- And: \`nr: &&\`
  - Both must be true: \`nr: true && false\` evaluates to \`nr: false\`, \`nr: true && true\` evaluates to \`nr: true\`
- Or: \`nr: ||\`
  - At least one must be true: \`nr: true || false\` evaluates to \`nr: true\`, \`nr: false || false\` evaluates to \`nr: false\`
- Short-circuit: \`nr: A && B\` skips \`nr: B\` if \`nr: A\` is false; \`nr: A || B\` skips \`nr: B\` if \`nr: A\` is true.

\`\`\`ruby
# title: Logical (binary)
# description: Combine boolean values with and/or.
true && false
---
true || false
\`\`\`

### Sequence operations (strings and arrays)

- Concatenation: \`nr: +\`
  - Joins things together: \`nr: "Hi" + "there"\` evaluates to \`nr: "Hithere"\`, \`nr: [1, 2] + [3]\` evaluates to \`nr: [1, 2, 3]\`
- Repetition: \`nr: *\`
  - Makes copies: \`nr: "ha" * 3\` evaluates to \`nr: "hahaha"\`, \`nr: [0] * 4\` evaluates to \`nr: [0, 0, 0, 0]\`

\`\`\`ruby
# title: Sequence operations (binary)
# description: Concatenate and repeat strings/arrays.
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
  - Changes the sign: \`nr: +5\` evaluates to \`nr: 5\`, \`nr: -5\` evaluates to \`nr: -5\`, \`nr: -(-3)\` evaluates to \`nr: 3\`
- Logical negation: \`nr: !a\`
  - Flips true/false: \`nr: !true\` evaluates to \`nr: false\`, \`nr: !false\` evaluates to \`nr: true\`

\`\`\`ruby
# title: Unary operators
# description: Apply operators that take a single input.
+5
---
-5
---
-(-3)
---
!true
---
!(2 < 3)
\`\`\`

## Precedence and grouping

- Parentheses \`nr: ( )\` change evaluation order.
  - Like math class: \`nr: (1 + 2) * 3\` evaluates to \`nr: 9\` (do the parentheses first)
- Precedence (high → low): \`nr: **\`, \`nr: * / %\`, \`nr: + -\`, comparisons, \`nr: !\`, \`nr: &&\`, \`nr: ||\`.
  - Without parentheses: \`nr: 1 + 2 * 3\` evaluates to \`nr: 7\` (multiplication happens first)

\`\`\`ruby
# title: Precedence and grouping
# description: See how precedence and parentheses affect evaluation.
1 + 2 * 3
---
(1 + 2) * 3
\`\`\`

## Ruby-specific extra operators

These are very useful in Ruby but are not universal across all languages:

- Membership: \`nr: include?\` (method on strings and arrays)
  - Checks if something contains something else: \`nr: "ruby".include?("by")\` evaluates to \`nr: true\`
- Case equality: \`nr: ===\` (used in case statements)
  - Special matching for ranges and classes: \`nr: (1..5) === 3\` evaluates to \`nr: true\` (3 is in range 1-5)
- Spaceship: \`nr: <=>\` (comparison returning -1, 0, or 1)
  - Three-way comparison: \`nr: 1 <=> 2\` evaluates to \`nr: -1\` (less), \`nr: 2 <=> 2\` evaluates to \`nr: 0\` (equal), \`nr: 3 <=> 2\` evaluates to \`nr: 1\` (greater)
- Range operators: \`nr: ..\` (inclusive), \`nr: ...\` (exclusive)
  - Creates sequences: \`nr: (1..5).to_a\` evaluates to \`nr: [1, 2, 3, 4, 5]\`, \`nr: (1...5).to_a\` evaluates to \`nr: [1, 2, 3, 4]\`
- Indexing and slicing: \`nr: seq[index]\`, \`nr: seq[start..stop]\`, \`nr: seq[start...stop]\`
  - Gets items by position: \`nr: [1, 2, 3][1]\` evaluates to \`nr: 2\`, \`nr: "ruby"[1..2]\` evaluates to \`nr: "ub"\`
- String interpolation: \`nr: "#{expression}"\`
  - Embeds code in strings: \`nr: "Hello #{name}"\` puts the value of \`nr: name\` into the string
- Safe navigation: \`nr: &.\`
  - Safely calls methods: \`nr: obj&.method\` evaluates to \`nr: nil\` if \`nr: obj\` is nil (instead of crashing)

\`\`\`ruby
# title: Ruby extras — membership, case equality, spaceship, ranges, slicing
# description: Explore Ruby-specific operators and forms.
arr = [1, 2, 3]
str = "ruby"
---
"ruby".include?("by")
---
arr.include?(2)
---
5 === 5
---
(1..5) === 3
---
1 <=> 2
---
2 <=> 2
---
3 <=> 2
---
range1 = 1..5
---
range2 = 1...5
---
range1.to_a
---
range2.to_a
---
arr[1..2]
---
str[1..2]
---
arr[1...3]
---
name = "Sam"
---
"Hello, #{name}!"
---
obj = nil
---
obj&.some_method
\`\`\`

You now know the common operators (binary and unary) and where Ruby adds extras; next you will use them with variables and assignments.`,
    codeItems: [],
    previousSection: 'values',
    nextSection: 'variables',
  },
  {
    id: 'types',
    title: 'Sets and Types',
    order: 10,
    content: `A type is a set of values that we give a name to.

We can name a type anything we want. For example:

* We could call the set \`nr: [1,2,3]\` **TinyNumber**
   * The type **TinyNumber** is the set of values \`nr: [1,2,3]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#4CAF50" stroke="#000" stroke-width="2"/>
  <path id="tinyNumberPath_rb" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#tinyNumberPath_rb" startOffset="50%" text-anchor="middle">TinyNumber</textPath>
  </text>
  <text x="90" y="90" fill="#FFFFFF" font-size="18">1</text>
  <text x="110" y="110" fill="#FFFFFF" font-size="18">2</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">3</text>
</svg>

* We could give the name **DogName** to the set \`nr: ["Max", "Ace", "Tiny"]\`
   * The type **DogName** is the set of values \`nr: ["Max", "Ace", "Tiny"]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
  <path id="dogNamePath_rb" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#dogNamePath_rb" startOffset="50%" text-anchor="middle">DogName</textPath>
  </text>
  <text x="80" y="90" fill="#FFFFFF" font-size="18">"Max"</text>
  <text x="85" y="110" fill="#FFFFFF" font-size="18">"Ace"</text>
  <text x="85" y="130" fill="#FFFFFF" font-size="18">"Tiny"</text>
</svg>


* We could name the set \`nr: [99, 100, 101]\` **AgeOfAnOldPerson**
   * The type **AgeOfAnOldPerson** is the set of values \`nr: [99, 100, 101]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#9C27B0" stroke="#000" stroke-width="2"/>
  <path id="ageOfAnOldPersonPath_rb" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#ageOfAnOldPersonPath_rb" startOffset="50%" text-anchor="middle">AgeOfAnOldPerson</textPath>
  </text>
  <text x="85" y="90" fill="#FFFFFF" font-size="18">99</text>
  <text x="95" y="110" fill="#FFFFFF" font-size="18">100</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">101</text>
</svg>

* We could say **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`
   * The type **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#F44336" stroke="#000" stroke-width="2"/>
  <path id="smallOddNumberPath_rb" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#smallOddNumberPath_rb" startOffset="50%" text-anchor="middle">SmallOddNumber</textPath>
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
  <path id="intPath_rb" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#intPath_rb" startOffset="50%" text-anchor="middle">WholeNumber</textPath>
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

In Ruby, whole numbers are instances of \`nr: Integer\` and numbers with decimals are instances of \`nr: Float\`.

Ruby has a bunch of built in classes:

* \`nr: TrueClass\` / \`nr: FalseClass\`
* \`nr: Integer\`
* \`nr: Float\`
* \`nr: String\`
* \`nr: Array\`
* \`nr: Hash\`
* \`nr: Set\`
* and many more
`,
    previousSection: 'conditionals',
    nextSection: 'next-steps',
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

In Ruby, you can create a new variable simply by assigning a value to it—no declaration is needed. This is different from languages like JavaScript and TypeScript, which require variables to be declared (with keywords like \`nr: let\`, \`nr: const\`, or \`nr: var\`) before or during their first assignment.

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

\`\`\`ruby
# title: Variable assignment
age = 25
---
name = "Alice"
\`\`\`

For example, we can assign our age to the \`nr: current_age\` variable, and then calculate our age next year by adding 1 to the value stored in the \`nr: current_age\` variable:

\`\`\`ruby
# title: Working with variables step by step
current_age = 10
---
age_next_year = current_age + 1
---
age_next_year
\`\`\`

Finally, we can change the value that a variable points at by assigning a new value to the variable:

\`\`\`ruby
# title: Variable reassignment example
my_age = 10
puts "my_age -> #{my_age}"   # this prints 10
---
my_age = 11
puts "my_age -> #{my_age}"   # this prints 11
\`\`\`

`,
    previousSection: 'operators',
    nextSection: 'expressions',
  },
  {
    id: 'expressions',
    title: 'Expressions',
    order: 7,
    content: `In Ruby, an expression is anything you can evaluate to get a value. This section surveys the major expression shapes you'll use every day.

The big categories we'll cover are:

- value literal expressions
- variable evaluation and variable assignment
- binary and unary operator expressions
- sequencing of expressions
- method definitions and method invocations
- conditional branching expressions
- looping expressions

### 1) Value literal expressions

- A literal writes the value directly in your code.
- Examples: numbers, strings, booleans, and collection literals like arrays, hashes, and ranges.

\`\`\`ruby
# title: Value literals — numbers, strings, booleans
# description: Literals evaluate to themselves.
42
---
3.14159
---
"Max"
---
true
---
false
\`\`\`

\`\`\`ruby
# title: Value literals — collections
# description: Literals for array, hash, and range.
[1, 2, 3]
---
{"a" => 1, "b" => 2}
---
1..5
\`\`\`

### 2) Variable evaluation and assignment

- Evaluating a variable name (like \`nr: x\`) yields the value it currently points to.
- Assignment uses \`nr: =\` to make a name point at a value; reassigning updates what the name points at.

\`\`\`ruby
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

\`\`\`ruby
# title: Binary operators — arithmetic and comparison
# description: Combine two values to produce a new one.
1 + 2
---
9 / 4
---
9 % 4
---
2 ** 5
---
3 < 5
---
3 == 3
\`\`\`

\`\`\`ruby
# title: Binary operators — sequence and membership
# description: Concatenate, repeat, or test for inclusion.
"Hi, " + "there"
---
"ha" * 3
---
[1, 2] + [3]
---
"ruby".include?("by")
---
[1, 2, 3].include?(3)
\`\`\`

\`\`\`ruby
# title: Unary operators — sign and logical negation
# description: Operate on a single value.
-5
---
+5
---
!true
---
!(2 < 1)
\`\`\`

### 4) Sequencing of expressions

- Lines run top-to-bottom; later expressions see the effects of earlier ones.

\`\`\`ruby
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

### 5) Method definitions

- \`nr: def\` creates a new method and binds it to a name.
- Methods can take parameters and return values.
- Ruby methods return the last evaluated expression automatically.

\`\`\`ruby
# title: Method definitions — def syntax
# description: Creating methods produces method objects.
def square(n)
  n * n
end
---
method(:square)  # look at the method object
---
def double(x)
  x * 2
end
---
method(:double)
\`\`\`

### 6) Method invocations

- Use parentheses \`nr: ( )\` to call a method; arguments go inside.
- Ruby allows omitting parentheses in many cases.
- A call expression evaluates to the method's return value.

\`\`\`ruby
# title: Method invocations — calling methods
# description: Parentheses perform a call; the result is the return value.
def square(n)
  n * n
end
---
square(6)
---
[1, 2, 3].length
---
-7.abs
\`\`\`

### 7) Conditional branching expressions

- \`nr: if\` / \`nr: elsif\` / \`nr: else\` chooses which block to run based on a condition.
- The ternary operator \`nr: A ? B : C\` picks one of two values.

\`\`\`ruby
# title: Conditional branching — if/elsif/else
# description: Only the first matching block runs.
age = 8
---
if age < 5
  puts "toddler"
elsif age < 10
  puts "kid"
else
  puts "older"
end
\`\`\`

\`\`\`ruby
# title: Conditional expression — a ? b : c
# description: Picks one of two values.
age = 8
---
age < 10 ? "kid" : "teen"
---
6 % 2 == 0 ? "even" : "odd"
\`\`\`

### 8) Looping expressions

- \`nr: for\` loops over a sequence; \`nr: while\` repeats while a condition is true.
- Ruby's enumerable methods like \`nr: each\`, \`nr: map\`, and \`nr: select\` are idiomatic ways to loop and transform data.

\`\`\`ruby
# title: Looping — for and while
# description: Repeat work while a condition holds or over a sequence.
for i in 0..2
  puts i
end
---
n = 3
while n > 0
  puts n
  n -= 1
end
\`\`\`

\`\`\`ruby
# title: Looping — enumerable methods for transformation
# description: Ruby's idiomatic approaches to loop and build new values.
[0, 1, 2, 3, 4, 5].map { |x| x * x }
---
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].select { |x| x % 2 == 0 }
---
[0, 1, 2, 3].reduce(0) { |acc, x| acc + x }
\`\`\`

You will combine these forms constantly: define names, compute with operators, branch and loop, and call methods. As you continue, try running the groups above with the Run buttons to see how the REPL preserves state across snippets within and across groups.
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


In Ruby, we would write down our recipe as a function that looks like this:
\`\`\`ruby
def make_sandwich(filling)
  puts("1. Get 2 pieces of bread.")
  puts("2. Open a jar of #{filling}.")
  puts("3. Use a knife to spread #{filling} onto the two pieces of bread.")
  puts("4. Put the two pieces of bread together.")
  puts("5. Congratulations! You built a #{filling} sandwich! Eat it!")
end
\`\`\`

Then, we would use the function to make a peanut butter sandwich and a ham sandwich:
\`\`\`ruby
puts "Make a peanut butter sandwich:"
make_sandwich("peanut butter")

puts "Make a ham sandwich:"
make_sandwich("ham")
\`\`\`


## Function Definition

Just as we did with the "Make a sandwich" recipe, we can write a function to do any kind of task.

A function definition creates a new function that does whatever you tell it to do, named with whatever name you give it.

You define a function with the \`nr: def\` keyword, followed by the function name, an optional list of parameters, a sequence of expressoins, and then end the function definition with the \`nr: end\` keyword, like this:

\`\`\`ruby
# title: Basic function definitions
# description: Creating functions with def...end syntax.
def function_name_goes_here(first_parameter, second_parameter)
  # sequence of expressions
end
---
# if you don't need any parameters, you can leave them off, like this:
def a_function_without_parameters
  # sequence of expressions
end
---
def say_hi
  puts "Hello to you!"
end
---
def add_numbers(a, b)
  result = a + b
  puts "#{a} + #{b} = #{result}"
  result
end
---
def calculate_area(width, height)
  width * height  # last expression is returned automatically
end
\`\`\`

### Parameters and Arguments

**Parameters** are like variables in the definition of a function that can be filled in with values when the function is used (i.e. called or invoked).

**Arguments** are the actual values that you give to the function when you use it (i.e. call or invoke it):

\`\`\`ruby
# title: Functions with parameters
# description: Parameters let functions work with different inputs.
def make_sandwich(bread_type, filling)
  puts "Making a #{filling} sandwich on #{bread_type} bread"
  "#{bread_type} #{filling} sandwich"
end
---
def calculate_tip(bill_amount, tip_percentage)
  tip = bill_amount * (tip_percentage / 100.0)
  puts "Bill: $#{bill_amount}, Tip: $#{tip.round(2)}"
  tip
end
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

\`\`\`ruby
# title: Function naming examples
# description: Good function names are descriptive and follow conventions.
def calculate_monthly_payment(principal, rate, months)
  monthly_rate = rate / 12.0
  payment = principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)
  payment.round(2)
end
---
def _helper_function
  "This is a private helper"
end
---
def user_age_in_days(birth_year)
  current_year = 2024
  (current_year - birth_year) * 365
end
---
calculate_monthly_payment(20000, 0.05, 60)
---
user_age_in_days(1990)
\`\`\`

## Function Invocation

You use a function by **calling** it (also called **invoking** it).

You call a function by using the function name like you would a variable name and then you add parentheses at the end of the name, like \`nr: function_name_goes_here()\`.

Some functions expect arguments (input values) to be passed to them when they are called. You pass these arguments to the function inside the parentheses, separated by commas, like \`nr: function_name_goes_here(first_argument_value, second_argument_value, ...)\`.

In Ruby, the parentheses are optional. You can call a function without parentheses, like \`nr: function_name_goes_here first_argument_value, second_argument_value, ...\`.

\`\`\`ruby
# title: Calling functions
# description: Execute functions by name with arguments.
def greet_user(name)
  "Hello, #{name}!"
end
---
def multiply(x, y)
  x * y
end
---
# Call with parentheses (recommended)
greet_user("Alice")
---
multiply(7, 8)
---
# Call without parentheses (Ruby style)
greet_user "Bob"
---
multiply 3, 4
\`\`\`

### Functions Without Parameters

Some functions don't need input to do their work:

\`\`\`ruby
# title: Parameter-free functions
# description: Functions that work without input.
def current_time
  Time.now.strftime("%H:%M:%S")
end
---
def random_number
  rand(1..100)
end
---
def system_info
  "Ruby version: #{RUBY_VERSION}"
end
---
current_time
---
lucky_number = random_number
puts "Your lucky number: #{lucky_number}"
---
system_info
\`\`\`

### Return Values

Functions can return a value back to the code that called it by using the \`nr: return\` keyword, like this: \`nr: return some_value_goes_here\`.

In Ruby, functions automatically return the value of the last expression in the body of the function.

\`\`\`ruby
# title: Function return values
# description: Functions can produce output values.
def calculate_discount(price, discount_percent)
  discount = price * (discount_percent / 100.0)
  final_price = price - discount
  return final_price  # explicit return
end
---
def format_currency(amount)
  "$#{amount.round(2)}"  # implicit return (last expression)
end
---
def validate_password(password)
  if password.length >= 8 && password.match(/[A-Z]/) && password.match(/[0-9]/)
    "Strong password"
  elsif password.length >= 6
    "Medium strength"
  else
    "Weak password"
  end
end
---
sale_price = calculate_discount(100, 20)
puts format_currency(sale_price)
---
puts validate_password("MyPass123")
---
puts validate_password("abc")
\`\`\`

### Practical Examples

Here are common function patterns you'll use:

\`\`\`ruby
# title: Practical function examples
# description: Real-world functions for common tasks.
def celsius_to_fahrenheit(celsius)
  (celsius * 9.0 / 5.0) + 32
end
---
def word_count(text)
  text.split.length
end
---
def is_even(number)
  number % 2 == 0
end
---
def format_name(first, last)
  "#{first.capitalize} #{last.capitalize}"
end
---
puts celsius_to_fahrenheit(25)
---
puts word_count("Ruby is a great programming language")
---
puts is_even(42)
---
puts format_name("john", "DOE")
\`\`\`

Like having a toolbox full of specialized tools, functions let you build reusable solutions once and use them throughout your program. Each function is like a reliable robot assistant that performs its specific task whenever called upon.`,
    previousSection: 'expressions',
    nextSection: 'conditionals',
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 9,
    content: `The primary conditional or branching expression is the \`if\` / \`elsif\` / \`else\` expression.

There are three variations:

* \`if\`
  * The \`if\` keyword is always followed by a boolean expression - an expression that evaluates to \`true\` or \`false\`.
  * When the boolean expression evaluates to \`true\`, the body of the \`if\` expression is evaluated; otherwise the body is skipped.

\`\`\`ruby
if i_am_hungry
  puts "I'm starving!"
end
\`\`\`

* \`if\` / \`else\`

\`\`\`ruby
if i_am_hungry
  puts "I'm starving!"
else
  puts "I am full."
end
\`\`\`

* \`if\` / \`elsif\` / \`else\`

\`\`\`ruby
if age < 5
  puts "You are younger than five years old."
elsif age < 10
  puts "You are five to nine years old."
else
  puts "You are ten or older"
end
\`\`\`

In each case, the \`if\` expression is always followed by an expression that evaluates to a boolean value.`,
    previousSection: 'functions',
    nextSection: 'types',
  },
  {
    id: 'next-steps',
    title: 'Next Steps',
    order: 11,
    content: `You're off to a great start. Here are some suggested next steps:

  ### Practice
  - Write tiny scripts that use variables, methods, and conditionals.

  ### Learn more (Resources)
  - Big-O notation explained clearly: [Big O by Sam Rose](https://samwho.dev/big-o/)

  ### Where to go next
  - Learn blocks, enumerables, and simple file scripts.`,
    previousSection: 'types',
  },
]
