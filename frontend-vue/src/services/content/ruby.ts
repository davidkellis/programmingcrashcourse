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
# title: A single snippet alongside a group
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
    content: `Operators combine or transform values to produce new values. You'll use them with numbers, strings, arrays, and booleans.

### Arithmetic operators (numbers)

- Addition: \`nr: +\`
- Subtraction: \`nr: -\`
- Multiplication: \`nr: *\`
- Division: \`nr: /\` (integer division when both operands are integers)
- Integer division method: \`nr: div\`
- Remainder (modulo): \`nr: %\`
- Exponent: \`nr: **\`

\`\`\`ruby
# title: Arithmetic operators
# description: Practice arithmetic operations with numbers.
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
9.div(2)   #=> 4
---
9 % 2
---
2 ** 3
\`\`\`

### Comparison operators (booleans)

- Equal: \`nr: ==\`  |  Not equal: \`nr: !=\`
- Less than / less than or equal: \`nr: <\`, \`nr: <=\`
- Greater than / greater than or equal: \`nr: >\`, \`nr: >=\`

\`\`\`ruby
# title: Comparison operators
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

### Boolean operators

- And: \`nr: &&\`  |  Or: \`nr: ||\`  |  Not: \`nr: !\`
- Short‑circuit: \`nr: A && B\` skips \`nr: B\` if \`nr: A\` is false; \`nr: A || B\` skips \`nr: B\` if \`nr: A\` is true.

\`\`\`ruby
# title: Boolean operators
# description: Combine boolean values with logical operators.
true && false
---
true || false
---
!(2 < 3)
\`\`\`

### Sequence operators (strings and arrays)

- Concatenation: \`nr: +\`
- Repetition: \`nr: *\`
- Membership: \`nr: include?\` (method on strings and arrays)
- Indexing and slicing: \`nr: seq[index]\`, \`nr: seq[start..stop]\`, \`nr: seq[start...stop]\`

\`\`\`ruby
# title: Sequence operators
# description: Work with strings and arrays using various operators.
"Hi, " + "there"
---
"ha" * 3
---
"ruby".include?("by")
---
[1, 2] + [3]
---
[0] * 4
---
[1,2,3,4][1..2]
\`\`\`

### Precedence and grouping

- Parentheses \`nr: ( )\` change evaluation order.
- Rough precedence (high → low): \`nr: **\`, \`nr: * / %\`, \`nr: + -\`, comparisons, \`nr: !\`, \`nr: &&\`, \`nr: ||\`.

\`\`\`ruby
# title: Precedence and grouping
# description: See how operator precedence and parentheses affect evaluation.
1 + 2 * 3
---
(1 + 2) * 3
\`\`\`

You now know the basic operators; next you will use them with variables and assignments.`,
    codeItems: [],
    previousSection: 'values',
    nextSection: 'variables',
  },
  {
    id: 'types',
    title: 'Sets and Types',
    order: 11,
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

In Ruby, you can create a new variable simply by assigning a value to it—no declaration is needed. Some languages like JavaScript and TypeScript require variables to be declared (with keywords like \`nr: let\`, \`nr: const\`, or \`nr: var\`) before or during their first assignment, but Ruby and Python allow you to create new variables directly through assignment.

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

* \`my_age = 10\`
* \`my_first_word = "cookie"\`
* \`number_of_cookies_i_want_to_eat = 100\`

When we use the name of a variable by itself, without the assignment operator, we are reading the value that the variable points at and doing something with that value.

For example, we can assign our age to the \`nr: my_age\` variable, and then calculate our age next year by adding 1 to the value stored in the \`nr: my_age\` variable:

\`\`\`ruby
my_age = 10
my_age_next_year = my_age + 1
my_age_next_year
\`\`\`

Finally, we can change the value that a variable points at by assigning a new value to the variable:

\`\`\`ruby
my_age = 10
puts "my_age -> #{my_age}"   # this prints 10
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
    content: `So far, we have seen several different kinds of expression:

* value literal expressions
  * \`123\` - integer literal expressions
  * \`3.14159\` - floating point literal expressions
  * \`true\` - boolean literal expressions
  * \`"Max"\` - string literal expressions
  * \`[1, 2, 3, 1, 2, 3]\` - array literal expressions
  * \`{1 => "one", 2 => "two"}\` - hash literal expressions
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

These common kinds of expression are what we are focusing on in this tutorial, because every language has them, so if you know what an assignment expression looks like in Ruby, then you know what it looks like in most every language.

### Comparison expressions

Comparison expressions evaluate to a boolean (\`nr: true\` or \`nr: false\`).

Try these:

\`\`\`ruby
1 == 1
1 != 2
3 < 5
5 <= 5
7 > 2
2 >= 9
\`\`\`

### Boolean logic expressions

Use \`nr: &&\`, \`nr: ||\`, and \`nr: !\` to combine or negate boolean values.

\`\`\`ruby
true && true
true && false
true || false
false || false
!true
!(1 < 2)
\`\`\`

Short-circuiting: in \`nr: A && B\`, if \`nr: A\` is false, Ruby does not evaluate \`nr: B\`. In \`nr: A || B\`, if \`nr: A\` is true, Ruby does not evaluate \`nr: B\`.

### Grouping and operator precedence

Parentheses \`nr: ( )\` change evaluation order. Arithmetic has the usual precedence (\`nr: * / %\` before \`nr: + -\`), then comparisons, then \`nr: !\`, then \`nr: &&\`, then \`nr: ||\`.

\`\`\`ruby
1 + 2 * 3
(1 + 2) * 3
10 - 4 - 1
10 - (4 - 1)
(2 < 3) && (3 < 5)
\`\`\`

### String expressions

\`nr: +\` concatenates strings; \`nr: *\` repeats them; interpolation uses \`nr: #{...}\`.

\`\`\`ruby
"Hello, " + "world!"
"ha" * 3
name = "Sam"
"Hello, " + name
"Hello, #{name}!"  # string interpolation
\`\`\`

### Array expressions

Arrays also support concatenation and repetition.

\`\`\`ruby
[1, 2] + [3, 4]
[0] * 5
[1, 2, 3].length
\`\`\`

### Indexing and slicing

Use square brackets to get elements or ranges from arrays and strings.

\`\`\`ruby
letters = ["a", "b", "c", "d", "e"]
letters[0]
letters[-1]
letters[1..3]
letters[0...3]

text = "ruby"
text[0]
text[-1]
text[1..3]
text[0...2]
\`\`\`

### Membership

Use \`nr: include?\` to test membership on arrays and strings.

\`\`\`ruby
[1, 2, 3].include?(3)
"ruby".include?("ru")
![1, 2, 3].include?(9)
!"ruby".include?("x")
\`\`\`

These forms are the building blocks you will combine inside conditionals, loops, and method calls in the next sections.`,
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

There are 2 simple rules that you must follow when naming a method in Ruby:

1. The name can't have any spaces or hyphens (dashes) in it. Replace spaces and hyphens with underscores.
   * Peanut Butter Sandwich → Peanut_Butter_Sandwich
   * Peanut-Butter-Sandwich → Peanut_Butter_Sandwich
2. The name can't begin with a number. It must begin with a letter or an underscore.
   * Bad names (won't work): \`nr: 1dog\`, \`nr: 2_apples\`
   * Good names (will work): \`nr: one_dog\`, \`nr: two_apples\`, \`nr: _20_people\`, \`nr: book_x5\`

In Ruby, we create a method by using the keyword \`nr: def\`, followed by the name of the method, optionally followed by parameters, and ending with \`nr: end\`, like this:

\`\`\`ruby
def make_peanut_butter_sandwich
  # method body goes here
end
\`\`\`

A method also has a body, which is just the list of instructions we want the method to evaluate. The method body is an expression sequence. For example:

\`\`\`ruby
def make_peanut_butter_sandwich(kind_of_bread, quantity)
  quantity.times do
    # toast_the_bread(kind_of_bread)
    # spread_peanut_butter_onto_the_toast()
    # smash_the_pieces_of_toast_with_peanut_butter_together()
    # clean_up()
    # put_the_sandwich_on_a_plate()
  end
end
\`\`\`

This method has one parameter: \`age\`

\`\`\`ruby
def print_my_age(age)
  puts "I am #{age} years old"
end
\`\`\`

This method has no parameters:

\`\`\`ruby
def print_hello
  puts "Hello"
end
\`\`\``,
    previousSection: 'expressions',
    nextSection: 'function-invocation',
  },
  {
    id: 'function-invocation',
    title: 'Function Invocation',
    order: 9,
    content: `You can use a method by calling it, or invoking it. Calling a method is the same thing as invoking it.

A method may be called, or invoked, by typing the name of the method, optionally followed by parentheses. If the method was defined to accept parameters, then you must supply values for those parameters.

For example, if we define a method without any parameters:

\`\`\`ruby
def print_hello
  puts "Hello"
end
\`\`\`

we can call it by typing its name, with or without parentheses:

\`\`\`ruby
print_hello
print_hello()
\`\`\`

When we call this method in an interactive interpreter session (IRB), here is what happens:

\`\`\`
irb(main):001:0> def print_hello
irb(main):002:1>   puts "Hello"
irb(main):003:1> end
=> :print_hello
irb(main):004:0> print_hello
Hello
=> nil
\`\`\`

If we have the following method with one parameter:

\`\`\`ruby
def print_my_age(age)
  puts "I am #{age} years old"
end
\`\`\`

we can call it by supplying the argument:

\`\`\`ruby
print_my_age(8)
print_my_age 8
\`\`\`

If we have the following method with two parameters:

\`\`\`ruby
def print_introduction(name, age)
  puts "Hello, my name is #{name} and I am #{age} years old"
end
\`\`\`

we can call it like this:

\`\`\`ruby
print_introduction("Jim", 9)
\`\`\`

Methods can also return values. Here is a method that returns a value:

\`\`\`
irb(main):001:0> def add_five(value)
irb(main):002:1>   return value + 5
irb(main):003:1> end
=> :add_five
irb(main):004:0> three_plus_five = add_five(3)
=> 8
irb(main):005:0> three_plus_five
=> 8
\`\`\``,
    previousSection: 'functions',
    nextSection: 'conditionals',
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 10,
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
    previousSection: 'function-invocation',
    nextSection: 'types',
  },
  {
    id: 'next-steps',
    title: 'Next Steps',
    order: 12,
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
