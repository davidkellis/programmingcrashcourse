import type { TutorialSection } from '@/types'

export const TYPESCRIPT_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome!

This is a programming tutorial that aims to teach you how to read and write code in the most widely used programming languages: Python, Ruby, C, C++, C#, Java, Scala, Kotlin, Groovy, JavaScript, TypeScript, Go, Nim, Rust, etc.

Most of the widely used languages look and behave very similarly. They are all [imperative languages](https://en.wikipedia.org/wiki/Imperative_programming). They are so similar that if you know one, you almost know them all.

Throughout the tutorial you'll see short code snippets illustrated like this: \`nr: 1 + 2\`. Some snippets have a green Run button with a little arrow like ➤, for example: \`1 + 2\`. Click the Run button with the arrow ➤ to evaluate it in the REPL (read-evaluate-print loop) docked to the right side or bottom of the page.

You'll see groups of snippets like this:

\`\`\`typescript
// title: Warm-up: Hello and Variables
// description: Run these in order to see how the REPL keeps state between snippets.
console.log('Hello from a grouped snippet!')
---
let x: number = 41
---
x + 1
\`\`\`

\`\`\`typescript
// title: A one-line summation expression
[1, 2, 3].reduce((a, b) => a + b, 0)
\`\`\`

You'll also see editable code blocks like this:

\`\`\`typescript
function say_hello(name: string): void {
  console.log("Hello " + name)
}

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
    content: `* lines that start with \`nr: //\` are comments
* comments are used to explain what the code does
* comments are ignored by the TypeScript compiler

\`\`\`typescript
// this line is a comment
// everything to the right of a // symbol is a comment and is ignored by the TypeScript compiler

// Let's see what happens when we run some actual code with comments
let message: string = "Hello from TypeScript!"; // this comment explains what this line does
console.log(message); // this comment explains we're printing the message
\`\`\``,
    previousSection: 'introduction',
    nextSection: 'values',
  },
  {
    id: 'values',
    title: 'Values',
    order: 3,
    content: `Values are the basic pieces of data that programs read, store, and manipulate. In TypeScript, the most common kinds of values are numbers, strings, booleans, arrays, maps (Map instances), and objects created from classes (instances).

These various kinds of values are also called "types". We will learn about sets and types in detail in the [Sets and Types](/section/types) section.

### Numbers

- Numbers are used for counting things, doing math, measuring quantities like time, distance, or cost.
- TypeScript has a single number type for integers and floating‑point values.
- You can use underscores instead of commas to make big numbers more readable.
  - Write 1,000,000 as \`nr: 1_000_000\` or \`nr: 1000000\`

\`\`\`typescript
// title: Numbers — literal values
// description: Evaluate number literals.
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
- Features: written with quotes, can include spaces and punctuation, support Unicode.

\`\`\`typescript
// title: Strings — literal values
// description: Evaluate string literals.
"Hello, world!"
---
'TypeScript is fun'
---
"😀 emojis are text, too"
\`\`\`

### Booleans (boolean)

- What they are used for: representing truth values for decisions, conditions, and flags.
- Values: \`nr: true\` and \`nr: false\`.

\`\`\`typescript
// title: Booleans — true/false
// description: Evaluate the two boolean values.
true
---
false
\`\`\`

### Arrays (Array)

- What they are used for: ordered collections of items; great for sequences like to‑do items, scores, or search results.
- Features: can hold values of any type, can be empty, can be nested.

\`\`\`typescript
// title: Arrays — literal values
// description: Evaluate array literals of different shapes.
[1, 3, 5, 7, 9]
---
["apples", "bananas", "cherries"]
---
[1000, "cookies", true]
---
[]  // an empty array
\`\`\`

### Maps (Map)

- What they are used for: mapping keys to values; great for lookups, configurations, and records.
- Features: keys must be unique; keys can be of any type; preserves insertion order.

\`\`\`typescript
// title: Maps — Map instances
// description: Construct Map instances with different key types.
new Map([[1, "one"], [2, "two"], [3, "three"]])
---
new Map([["Jack", "Cookies"], ["Jill", "Ice Cream"], ["Phil", "Asparagus"]])
\`\`\`

### Class instances (instances of classes)

- What they are used for: representing real‑world things with data (properties) and behavior (methods), like a \`Dog\`, \`Car\`, or \`BankAccount\`.
- Example: creating an instance of a simple class.

\`\`\`typescript
// title: Objects — class instances
// description: Define a class, create an instance, and evaluate it.
class Dog {
  constructor(public name: string) {}
}
---
const my_dog = new Dog("Max")
---
my_dog
\`\`\`

You will use these values inside expressions, assignments, function calls, and conditionals in the rest of this tutorial.`,
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
- Division: \`nr: /\`
  - Splits into equal parts: \`nr: 10 / 2\` evaluates to \`nr: 5\` (always a decimal in TypeScript)
- Remainder (modulo): \`nr: %\`
  - What's left after division: \`nr: 10 % 3\` evaluates to \`nr: 1\` (10 ÷ 3 = 3 remainder 1)
- Exponent: \`nr: **\`
  - Repeated multiplication: \`nr: 2 ** 3\` means \`nr: 2 * 2 * 2\` which evaluates to \`nr: 8\`

\`\`\`typescript
// title: Arithmetic (binary)
// description: Practice common arithmetic operations.
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
  - Checks if values are the same (with type conversion): \`nr: 5 == '5'\` evaluates to \`nr: true\`
- Strict equal: \`nr: ===\`  |  Strict not equal: \`nr: !==\`
  - Checks if values and types are exactly the same: \`nr: 5 === 5\` evaluates to \`nr: true\`, but \`nr: 5 === '5'\` evaluates to \`nr: false\`
- Less than / less than or equal: \`nr: <\`, \`nr: <=\`
  - Compares size: \`nr: 3 < 5\` evaluates to \`nr: true\`, \`nr: 5 <= 5\` evaluates to \`nr: true\`
- Greater than / greater than or equal: \`nr: >\`, \`nr: >=\`
  - Compares size the other way: \`nr: 7 > 3\` evaluates to \`nr: true\`, \`nr: 4 >= 4\` evaluates to \`nr: true\`

\`\`\`typescript
// title: Comparison (binary)
// description: Compare values to get boolean results.
3 == 3
---
3 === 3
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

\`\`\`typescript
// title: Logical (binary)
// description: Combine boolean values with and/or.
true && false
---
true || false
\`\`\`

### Sequence operations (strings and arrays)

- Concatenation: \`nr: +\` (strings), \`nr: .concat()\` (arrays)
  - Joins things together: \`nr: "Hi" + "there"\` evaluates to \`nr: "Hithere"\`, \`nr: [1, 2].concat([3])\` evaluates to \`nr: [1, 2, 3]\`
- Repetition: \`nr: 'str'.repeat(n)\`
  - Makes copies: \`nr: "ha".repeat(3)\` evaluates to \`nr: "hahaha"\`
- Spread: \`nr: [...arr1, ...arr2]\`
  - Expands arrays: \`nr: [...[1, 2], ...[3, 4]]\` evaluates to \`nr: [1, 2, 3, 4]\`

\`\`\`typescript
// title: Sequence operations (binary)
// description: Concatenate and repeat strings/arrays.
"Hi, " + "there"
---
"ha".repeat(3)
---
[1, 2].concat([3])
---
[...["a", "b"], ...["c"]]
---
Array(4).fill(0)
\`\`\`

## Unary operators

- Numeric sign: \`nr: +a\` (unary plus), \`nr: -a\` (negation)
  - Changes the sign: \`nr: +5\` evaluates to \`nr: 5\`, \`nr: -5\` evaluates to \`nr: -5\`, \`nr: -(-3)\` evaluates to \`nr: 3\`
- Logical negation: \`nr: !a\`
  - Flips true/false: \`nr: !true\` evaluates to \`nr: false\`, \`nr: !false\` evaluates to \`nr: true\`
- Type inquiry: \`nr: typeof a\`
  - Tells you what type something is: \`nr: typeof 42\` evaluates to \`nr: "number"\`, \`nr: typeof "hello"\` evaluates to \`nr: "string"\`

\`\`\`typescript
// title: Unary operators
// description: Apply operators that take a single input.
+5
---
-5
---
-(-3)
---
!true
---
!(2 < 3)
---
typeof 42
---
typeof "hello"
\`\`\`

## Precedence and grouping

- Parentheses \`nr: ( )\` change evaluation order.
  - Like math class: \`nr: (1 + 2) * 3\` evaluates to \`nr: 9\` (do the parentheses first)
- Precedence (high → low): \`nr: **\`, \`nr: * / %\`, \`nr: + -\`, comparisons, \`nr: !\`, \`nr: &&\`, \`nr: ||\`.
  - Without parentheses: \`nr: 1 + 2 * 3\` evaluates to \`nr: 7\` (multiplication happens first)

\`\`\`typescript
// title: Precedence and grouping
// description: See how precedence and parentheses affect evaluation.
1 + 2 * 3
---
(1 + 2) * 3
\`\`\`

## TypeScript-specific extra operators

These are very useful in TypeScript but are not universal across all languages:

- Indexing: \`nr: seq[index]\`
  - Gets an item by position: \`nr: [1, 2, 3][1]\` evaluates to \`nr: 2\` (arrays start at 0)
- Optional chaining: \`nr: ?.\`
  - Safely accesses properties: \`nr: obj?.someMethod\` evaluates to \`nr: undefined\` if \`nr: obj\` is null (instead of crashing)
- Nullish coalescing: \`nr: ??\`
  - Provides backup values: \`nr: null ?? "default"\` evaluates to \`nr: "default"\`
- Non-null assertion: \`nr: !\` (postfix)
  - Tells TypeScript you're sure something isn't null: \`nr: value!\` (use carefully!)
- Type assertion: \`nr: as Type\`
  - Tells TypeScript to treat something as a specific type: \`nr: (value as string).toUpperCase()\`

\`\`\`typescript
// title: TypeScript extras — membership, indexing, templates, optional chaining, type assertions
// description: Explore TypeScript-specific operators and forms.
const arr: number[] = [1, 2, 3]
const str: string = "typescript"
---
arr[1]
---
str[1]
---
const name: string = "Sam"
---
const obj: any = null
---
obj?.someMethod
---
const value: string | null = null
---
value ?? "default"
---
const maybeString: unknown = "hello"
---
(maybeString as string).toUpperCase()
\`\`\`

You now know the common operators (binary and unary) and where TypeScript adds extras; next you will use them with variables and assignments.`,
    previousSection: 'values',
    nextSection: 'variables',
  },
  {
    id: 'types',
    title: 'Sets and Types',
    order: 12,
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
    <text x="80" y="100" fill="#FFFFFF" font-size="18">Jack</text>
    <text x="90" y="120" fill="#FFFFFF" font-size="18">Jill</text>
  </svg>
</div>

### This is a set of different kinds of things:

* \`nr: [ 1, 3.141592653589793, "Steve", true ]\`

<div style="display: flex; justify-content: center; margin: 1em 0;">
   <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
   <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
   <text x="85" y="90" fill="#FFFFFF" font-size="16">1</text>
   <text x="25" y="110" fill="#FFFFFF" font-size="16">3.141592653589793</text>
   <text x="90" y="130" fill="#FFFFFF" font-size="16">Steve</text>
   <text x="90" y="150" fill="#FFFFFF" font-size="16">true</text>
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
  <path id="tinyNumberPath_ts" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#tinyNumberPath_ts" startOffset="50%" text-anchor="middle">TinyNumber</textPath>
  </text>
  <text x="90" y="90" fill="#FFFFFF" font-size="18">1</text>
  <text x="110" y="110" fill="#FFFFFF" font-size="18">2</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">3</text>
</svg>

* We could give the name **DogName** to the set \`nr: ["Max", "Ace", "Tiny"]\`
   * The type **DogName** is the set of values \`nr: ["Max", "Ace", "Tiny"]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
  <path id="dogNamePath_ts" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#dogNamePath_ts" startOffset="50%" text-anchor="middle">DogName</textPath>
  </text>
  <text x="80" y="90" fill="#FFFFFF" font-size="18">"Max"</text>
  <text x="85" y="110" fill="#FFFFFF" font-size="18">"Ace"</text>
  <text x="85" y="130" fill="#FFFFFF" font-size="18">"Tiny"</text>
</svg>


* We could name the set \`nr: [99, 100, 101]\` **AgeOfAnOldPerson**
   * The type **AgeOfAnOldPerson** is the set of values \`nr: [99, 100, 101]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#9C27B0" stroke="#000" stroke-width="2"/>
  <path id="ageOfAnOldPersonPath_ts" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#ageOfAnOldPersonPath_ts" startOffset="50%" text-anchor="middle">AgeOfAnOldPerson</textPath>
  </text>
  <text x="85" y="90" fill="#FFFFFF" font-size="18">99</text>
  <text x="95" y="110" fill="#FFFFFF" font-size="18">100</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">101</text>
</svg>

* We could say **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`
   * The type **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#F44336" stroke="#000" stroke-width="2"/>
  <path id="smallOddNumberPath_ts" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#smallOddNumberPath_ts" startOffset="50%" text-anchor="middle">SmallOddNumber</textPath>
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
  <path id="intPath_ts" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#intPath_ts" startOffset="50%" text-anchor="middle">WholeNumber</textPath>
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

In TypeScript, there is a type called \`nr: number\` that is the set of all numbers:

* \`nr: [..., -10.1, -2.0, -1.6, 0.0, 0.5, 1.0, 2.8, 3.1, 1000.0, ...]\`

TypeScript has a bunch of built in types:

* \`nr: boolean\`
* \`nr: number\`
* \`nr: string\`
* \`nr: object\`
* \`nr: any\`
* \`nr: Array<T>\` (this is a generic type; we will cover this later on)
* and many more
`,
    previousSection: 'classes-and-objects',
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

A variable can only point at one value at a time; however, we can change the value that a variable points at.

<div>
  <img src="/whatiateforbreakfast_reassignment.png" alt="Variable reassignment example showing what_i_ate_for_breakfast changing from 'cereal' to 'toast'" style="max-width: 100%; height: auto; margin: 10px 0;" />
</div>

<div>
  <img src="/mycurrentage_reassignment.png" alt="Variable reassignment example showing my_current_age changing from 10 to 10.5" style="max-width: 100%; height: auto; margin: 10px 0;" />
</div>

When we make a variable point at a value, we say that we are assigning a value to a variable; this process is called assignment.

## Assignment

We use the equal sign, \`nr: =\` , to make a variable point at a value, like this: \`nr: my_age_last_year = 25\`

This makes the \`nr: my_age_last_year\` variable point to the value \`nr: 25\`.

The equal sign, \`nr: =\` , is called the assignment operator.

When we use the assignment operator, \`nr: =\` , to make a variable point at a value, we call that an assignment expression.

These are all assignment expressions:

* \`nr: my_age = 10\`
* \`nr: my_first_word = "cookie"\`
* \`nr: number_of_cookies_i_want_to_eat = 100\`

In TypeScript, variables must be declared using keywords like \`nr: let\`, \`nr: const\`, or \`nr: var\` before or during their first assignment. This is different from languages like Python and Ruby, where you can create variables directly through assignment without any declaration keywords.

For example, this is a variable declaration:

\`\`\`typescript
// title: Variable declaration with let and const
let age: number = 25
---
const name: string = "Alice"
\`\`\`

When we use the name of a variable by itself, without the assignment operator, we are reading the value that the variable points at and doing something with that value.

For example, we can assign our age to the \`nr: current_age\` variable, and then calculate our age next year by adding 1 to the value stored in the \`nr: current_age\` variable:

\`\`\`typescript
// title: Working with variables step by step
let current_age: number = 10
---
let age_next_year: number = current_age + 1
---
age_next_year
\`\`\`

Finally, we can change the value that a variable points at by assigning a new value to the variable:

\`\`\`typescript
// title: Variable reassignment example
let my_age: number = 10
console.log(\`my_age -> \${my_age}\`)   // this prints 10
---
my_age = 11
console.log(\`my_age -> \${my_age}\`)   // this prints 11
\`\`\`

`,
    previousSection: 'operators',
    nextSection: 'expressions',
  },
  {
    id: 'expressions',
    title: 'Expressions',
    order: 7,
    content: `In TypeScript, an expression is anything you can evaluate to get a value. This section surveys the major expression shapes you'll use every day.

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
- Examples: numbers, strings, booleans, and collection literals like arrays, objects, and Maps.

\`\`\`typescript
// title: Value literals — numbers, strings, booleans
// description: Literals evaluate to themselves.
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

\`\`\`typescript
// title: Value literals — collections
// description: Literals for array, object, and Map.
[1, 2, 3]
---
{"a": 1, "b": 2}
---
new Map([["x", 1], ["y", 2]])
\`\`\`

### 2) Variable evaluation and assignment

- Evaluating a variable name (like \`nr: x\`) yields the value it currently points to.
- Assignment uses \`nr: =\` to make a name point at a value; reassigning updates what the name points at.

\`\`\`typescript
// title: Variables — evaluation vs assignment
// description: Read a name to get its value; use = to change it.
let pet: string = "dog"
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

\`\`\`typescript
// title: Binary operators — arithmetic and comparison
// description: Combine two values to produce a new one.
1 + 2
---
Math.floor(9 / 4)
---
9 % 4
---
2 ** 5
---
3 < 5
---
3 === 3
\`\`\`

\`\`\`typescript
// title: Binary operators — sequence and membership
// description: Concatenate, repeat, or test for inclusion.
"Hi, " + "there"
---
"ha".repeat(3)
---
[1, 2].concat([3])
---
"typescript".includes("script")
---
[1, 2, 3].includes(3)
\`\`\`

\`\`\`typescript
// title: Unary operators — sign and logical negation
// description: Operate on a single value.
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

\`\`\`typescript
// title: Sequencing — executed top to bottom
// description: Each line runs after the previous one; names keep their values.
let x: number = 1
---
x = x + 2
---
x
---
let y: number = x * 3
---
y
\`\`\`

### 5) Function definitions

- \`nr: function\` creates a new function object and binds it to a name.
- Arrow functions \`nr: =>\` provide a compact way to create function values inline.
- TypeScript adds type annotations for parameters and return values.

\`\`\`typescript
// title: Function definitions — function and arrow syntax with types
// description: Creating functions produces function values.
function square(n: number): number {
  return n * n
}
---
square  // look at the function object
---
const double = (x: number): number => x * 2
---
double
\`\`\`

### 6) Function invocations

- Use parentheses \`nr: ( )\` to call a function; arguments go inside.
- A call expression evaluates to the function's return value.

\`\`\`typescript
// title: Function invocations — calling functions
// description: Parentheses perform a call; the result is the return value.
function square(n: number): number {
  return n * n
}
---
square(6)
---
[1, 2, 3].length
---
Math.abs(-7)
\`\`\`

### 7) Conditional branching expressions

- \`nr: if\` / \`nr: else if\` / \`nr: else\` chooses which block to run based on a condition.
- The ternary operator \`nr: A ? B : C\` picks one of two values.

\`\`\`typescript
// title: Conditional branching — if/else if/else
// description: Only the first matching block runs.
let age: number = 8
---
if (age < 5) {
  console.log("toddler")
} else if (age < 10) {
  console.log("kid")
} else {
  console.log("older")
}
\`\`\`

\`\`\`typescript
// title: Conditional expression — a ? b : c
// description: Picks one of two values.
let age: number = 8
---
age < 10 ? "kid" : "teen"
---
(6 % 2 === 0) ? "even" : "odd"
\`\`\`

### 8) Looping expressions

- \`nr: for\` loops over a sequence; \`nr: while\` repeats while a condition is true.
- Array methods like \`nr: map\`, \`nr: filter\`, and \`nr: reduce\` are functional ways to loop and transform data.

\`\`\`typescript
// title: Looping — for and while
// description: Repeat work while a condition holds or over a sequence.
for (let i: number = 0; i < 3; i++) {
  console.log(i)
}
---
let n: number = 3
while (n > 0) {
  console.log(n)
  n--
}
\`\`\`

\`\`\`typescript
// title: Looping — array methods for transformation
// description: Functional approaches to loop and build new values.
[0, 1, 2, 3, 4, 5].map((x: number): number => x * x)
---
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x: number): boolean => x % 2 === 0)
---
[0, 1, 2, 3].reduce((acc: number, x: number): number => acc + x, 0)
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


In TypeScript, we would write down our recipe as a function that looks like this:
\`\`\`typescript
function make_sandwich(filling: string): void {
  console.log("1. Get 2 pieces of bread.");
  console.log(\`2. Open a jar of \${filling}.\`);
  console.log(\`3. Use a knife to spread \${filling} onto the two pieces of bread.\`);
  console.log("4. Put the two pieces of bread together.");
  console.log(\`5. Congratulations! You built a \${filling} sandwich! Eat it!\`);
}
\`\`\`

Then, we would use the function to make a peanut butter sandwich and a ham sandwich:
\`\`\`typescript
console.log("Make a peanut butter sandwich:");
make_sandwich("peanut butter");

console.log("Make a ham sandwich:");
make_sandwich("ham");
\`\`\`


## Function Definition

Just as we did with the "Make a sandwich" recipe, we can write a function to do any kind of task.

A function definition creates a new function that does whatever you tell it to do, named with whatever name you give it.

You define a function with the \`nr: function\` keyword, followed by the function name, an optional list of parameters with type annotations, a return type annotation, a sequence of expressions, and then end the function definition with a closing brace, like this:

\`\`\`typescript
// title: Basic function definitions
// description: Creating functions with function keyword syntax and type annotations.
function function_name_goes_here(first_parameter: Type1, second_parameter: Type2): ReturnType {
  // sequence of expressions
}
---
// if you don't need any parameters, you can leave them off, like this:
function a_function_without_parameters(): ReturnType {
  // sequence of expressions
}
---
function say_hi(): void {
  console.log("Hello to you!");
}
---
function add_numbers(a: number, b: number): number {
  const result: number = a + b;
  console.log(\`\${a} + \${b} = \${result}\`);
  return result;
}
---
function calculate_area(width: number, height: number): number {
  return width * height;  // explicit return required in TypeScript
}
\`\`\`

### Parameters and Arguments

**Parameters** are like variables in the definition of a function that can be filled in with values when the function is used (i.e. called or invoked).

**Arguments** are the actual values that you give to the function when you use it (i.e. call or invoke it):

\`\`\`typescript
// title: Functions with parameters
// description: Parameters let functions work with different inputs.
function make_fancy_sandwich(bread_type: string, filling: string): string {
  console.log(\`Making a \${filling} sandwich on \${bread_type} bread\`);
  return \`\${bread_type} \${filling} sandwich\`;
}
---
function calculate_tip(bill_amount: number, tip_percentage: number): number {
  const tip: number = bill_amount * (tip_percentage / 100.0);
  console.log(\`Bill: $\${bill_amount}, Tip: $\${tip.toFixed(2)}\`);
  return tip;
}
---
make_fancy_sandwich("sourdough", "turkey")
---
calculate_tip(50, 18)
\`\`\`

### Function Names

Function names are named like variable names:
- Use letters, numbers, and underscores only
- Start with a letter or underscore (not a number)
- Use snake_case for multi-word names

\`\`\`typescript
// title: Function naming examples
// description: Good function names are descriptive and follow conventions.
function calculate_monthly_payment(principal: number, rate: number, months: number): number {
  const monthly_rate: number = rate / 12.0;
  const payment: number = principal * monthly_rate / (1 - Math.pow(1 + monthly_rate, -months));
  return Math.round(payment * 100) / 100;
}
---
function _helper_function(): string {
  return "This is a private helper";
}
---
function user_age_in_days(birth_year: number): number {
  const current_year: number = 2024;
  return (current_year - birth_year) * 365;
}
---
calculate_monthly_payment(20000, 0.05, 60)
---
user_age_in_days(1990)
\`\`\`

## Function Invocation

You use a function by **calling** it (also called **invoking** it).

You call a function by using the function name like you would a variable name and then you add parentheses at the end of the name, like \`nr: function_name_goes_here()\`.

Some functions expect arguments (input values) to be passed to them when they are called. You pass these arguments to the function inside the parentheses, separated by commas, like \`nr: function_name_goes_here(first_argument_value, second_argument_value, ...)\`.

In TypeScript, the parentheses are required when calling functions.

\`\`\`typescript
// title: Calling functions
// description: Execute functions by name with arguments.
function greet_user(name: string): string {
  return \`Hello, \${name}!\`;
}
---
function multiply_two_numbers(x: number, y: number): number {
  return x * y;
}
---
// Call with parentheses (required in TypeScript)
greet_user("Alice")
---
multiply_two_numbers(7, 8)
---
// Store result in variable
const greeting: string = greet_user("Bob");
greeting
---
const product: number = multiply_two_numbers(3, 4);
product
\`\`\`

### Functions Without Parameters

Some functions don't need input to do their work:

\`\`\`typescript
// title: Parameter-free functions
// description: Functions that work without input.
function current_time(): string {
  return new Date().toLocaleTimeString();
}
---
function random_number(): number {
  return Math.floor(Math.random() * 100) + 1;
}
---
function system_info(): string {
  return \`TypeScript version: 5.0+\`;
}
---
current_time()
---
const lucky_number: number = random_number();
console.log(\`Your lucky number: \${lucky_number}\`);
---
system_info()
\`\`\`

### Return Values

Functions can return a value back to the code that called it by using the \`nr: return\` keyword, like this: \`nr: return some_value_goes_here\`.

In TypeScript, if you don't specify a return value, the function returns \`nr: undefined\`. You should always specify return types for clarity.

\`\`\`typescript
// title: Function return values
// description: Functions can produce output values.
function calculate_discount(price: number, discount_percent: number): number {
  const discount: number = price * (discount_percent / 100.0);
  const final_price: number = price - discount;
  return final_price;  // explicit return
}
---
function format_currency(amount: number): string {
  return \`$\${amount.toFixed(2)}\`;  // explicit return
}
---
function validate_password(password: string): string {
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return "Strong password";
  } else if (password.length >= 6) {
    return "Medium strength";
  } else {
    return "Weak password";
  }
}
---
const sale_price: number = calculate_discount(100, 20);
sale_price
---
format_currency(sale_price)
---
validate_password("MyPass123")
---
validate_password("weak")
\`\`\`

### Practical Examples

Here are some common function patterns you'll use frequently:

\`\`\`typescript
// title: Common function patterns
// description: Real-world function examples you'll use often.
// Helper function for calculations
function celsius_to_fahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}
---
// Function that processes data
function format_name(first: string, last: string): string {
  return \`\${last.toUpperCase()}, \${first}\`;
}
---
// Function with validation
function safe_divide(a: number, b: number): number | string {
  if (b === 0) {
    return "Cannot divide by zero";
  }
  return a / b;
}
---
celsius_to_fahrenheit(25)
---
format_name("john", "DOE")
---
safe_divide(10, 2)
---
safe_divide(10, 0)
\`\`\`

Like having a toolbox full of specialized tools, functions let you build reusable solutions once and use them throughout your program. Each function is like a reliable robot assistant that performs its specific task whenever called upon.`,
    previousSection: 'expressions',
    nextSection: 'conditionals',
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 9,
    content: `Conditional expressions (also called branching expressions) let you make decisions in your program.

For example, here is a conditional expression written in english:

> If the temperature outside is colder than 50 degrees:
> &nbsp;&nbsp; Wear a coat.
> Otherwise:
> &nbsp;&nbsp; Wear shorts and flip-flops.

Here is an illustration that helps to understand the decision we are making:

<div>
  <img src="/temperature_condition.png" alt="Temperature Condition: if temperature_outside < 50: Wear a coat. else: Wear shorts and flip-flops." />
</div>

A conditional expression is how we tell the program to consider a situation and then make different decisions based on the situation.

In TypeScript, we can write this as:

\`\`\`typescript
const temperature_outside: number = Math.floor(Math.random() * 71) + 30; // 30 to 100
console.log("Temperature outside:", temperature_outside)

if (temperature_outside < 50) {
  console.log("Wear a coat.")
} else {
  console.log("Wear shorts and flip-flops.")
}
\`\`\`

## \`nr: if\` / \`nr: else if\` / \`nr: else\` Expressions

The way we can make decisions in our TypeScript programs is to use \`nr: if\` / \`nr: else if\` / \`nr: else\` expressions.

There are three variations:

### \`nr: if\` expressions

Simple \`nr: if\` expressions look like this:

\`\`\`typescript
nr:
if (<condition>) {
  <block of code>
}
\`\`\`

For example:

\`\`\`typescript
const isNight: boolean = true
if (isNight) {
  console.log("Turn on the night light.")
}
\`\`\`

An \`nr: if\` expression runs a block of code when the condition is \`nr: true\`. If the condition is \`nr: false\`, the block of code is skipped.

### \`nr: if / else\` expressions

An \`nr: if / else\` expression looks like this:

\`\`\`typescript
nr:
if (<condition>) {
  <block of code>
} else {
  <block of code>
}
\`\`\`

For example:

\`\`\`typescript
const isNight: boolean = true
if (isNight) {
  console.log("Turn on the night light.")
} else {
  console.log("Turn off the night light.")
}
\`\`\`

An \`nr: if / else\` expression runs the first block of code when the condition is \`nr: true\`. If the condition is \`nr: false\`, the second block of code is run.

Only one of the blocks of code will run, and then the if/else expression is finished.

Whatever code comes after the if/else expression is run next.

### \`nr: if / else if / else\` expressions

An \`nr: if / else if / else\` expression looks like this:

\`\`\`typescript
nr:
if (<condition>) {
  <block of code>
} else if (<condition>) {
  <block of code>
} else {
  <block of code>
}
\`\`\`

For example:

\`\`\`typescript
const temperatureInTheHouse: number = 70
if (temperatureInTheHouse <= 65) {
  console.log("Brrr. It's cold! Turn on the heater!")
} else if (temperatureInTheHouse > 65 && temperatureInTheHouse < 78) {
  console.log("It's comfortable. We don't need to turn on the air conditioner or the heater.")
} else {
  console.log("It's hot! Turn on the air conditioner!")
}
\`\`\`

An \`nr: if / else if / else\` expression runs the first block of code when the first condition is \`nr: true\`.
If the first condition is \`nr: false\`, then we don't run the first block of code, and instead we consider the second condition (the \`else if\` condition). If the second condition is \`nr: true\`, then we run the second block of code.
If the second condition is \`nr: false\`, then we don't run the first or second block of code, and instead we run the last block of code (the \`else\` condition).

Only one of the blocks of code will run, and then the if/else if/else expression is finished.
Whatever code comes after the if/else if/else expression is run next.


### Special rules in TypeScript

TypeScript (like JavaScript) has specific rules about how we must write \`nr: if\`, \`nr: else if\`, and \`nr: else\` expressions (conditional expressions):

- Conditions go inside parentheses: \`nr: if (condition) { ... }\`.
- Code blocks go inside curly braces: \`nr: { ... }\`.
- There are no colons at the end of the \`nr: if\`, \`nr: else if\`, or \`nr: else\` lines.
- Indentation is not required by the language but is strongly recommended for readability.
- Each condition should be a boolean expression (something that evaluates to \`nr: true\` or \`nr: false\`).
  - Remember from the Operators section that boolean expressions like \`nr: 4 === 4\` or \`nr: 1 < 5\` or \`nr: 1 === 2\` evaluate to \`nr: true\` or \`nr: false\`).
- In TypeScript, you can add type annotations to variables used in conditions to make your code clearer (e.g., \`nr: const isNight: boolean = true\`).


### Example: Hubcap of Havoc

Here is another example that demonstrates the conditions we use to play a game:

<div>
  <img src="/hubcap_of_havoc.png" alt="Hubcap of Havoc" />
</div>

In this game, a lucky contestant spins the Hubcap of Havoc and does whatever the arrow points to.

To play the Hubcap of Havoc game, we follow these steps:

> Spin the wheel.
> If the arrow points to 0:
> &nbsp;&nbsp; We milk a bear.
> If the arrow points to 1:
> &nbsp;&nbsp; We adopt a wolverine.
> If the arrow points to 2:
> &nbsp;&nbsp; We eat a basketball.
> If the arrow points to 3:
> &nbsp;&nbsp; We tickle an electric eel.
> If the arrow points to 4:
> &nbsp;&nbsp; We sleep on an ant bed.
> If the arrow points to 5:
> &nbsp;&nbsp; We kiss a shark.
> If the arrow points to 6:
> &nbsp;&nbsp; We give a lion a bath.
> If the arrow points to 7:
> &nbsp;&nbsp; We shave a gorilla.

In TypeScript, we can write this as:

\`\`\`typescript
function spinTheWheel(): number {
  return Math.floor(Math.random() * 8) // 0..7
}

function playHubcapOfHavoc(): void {
  const spinResult: number = spinTheWheel()
  if (spinResult === 0) {
    console.log("Milk a bear.")
  } else if (spinResult === 1) {
    console.log("Adopt a wolverine.")
  } else if (spinResult === 2) {
    console.log("Eat a basketball.")
  } else if (spinResult === 3) {
    console.log("Tickle an electric eel.")
  } else if (spinResult === 4) {
    console.log("Sleep on an ant bed.")
  } else if (spinResult === 5) {
    console.log("Kiss a shark.")
  } else if (spinResult === 6) {
    console.log("Give a lion a bath.")
  } else if (spinResult === 7) {
    console.log("Shave a gorilla.")
  }
}

console.log("Lucky contestant #1:")
playHubcapOfHavoc()

console.log("Lucky contestant #2:")
playHubcapOfHavoc()

console.log("Lucky contestant #3:")
playHubcapOfHavoc()
\`\`\`

## One-line conditional expression

Sometimes you want to choose between two values depending on a simple condition, and you want to do it in one line of code to make it easier to understand.

TypeScript (like JavaScript) has a compact form of if/else expression for this case: \`nr: condition ? A : B\`. It evaluates to \`nr: A\` when the condition is \`nr: true\`, and evaluates to \`nr: B\` when the condition is \`nr: false\`.

\`\`\`typescript
// title: Conditional expression — cond ? A : B
// description: Pick one value based on a condition.
let age: number = 8
---
age < 10 ? "kid" : "teen"
---
(6 % 2 === 0) ? "even" : "odd"
\`\`\`
`,
    previousSection: 'functions',
    nextSection: 'loops',
  },
  {
    id: 'loops',
    title: 'Loops',
    order: 10,
    content: `Loops let you perform the same action multiple times.

For example, here is a simple instruction in English:

> Count down from 3 to 1, saying each number out loud.
> Then say "Lift off!"

For example, in TypeScript, we could count down using a while loop:

\`\`\`typescript
let i: number = 3;
while (i > 0) {
  console.log(i);
  i--;
}
console.log("Lift off!");
\`\`\`

There are also other ways to do the same thing. The next section will explain the ways we can write a loop in TypeScript.

## Different kinds of loop

### \`nr: while\` loop

The while loop runs a block of code while a condition stays \`nr: true\`:

\`\`\`typescript
nr:
while (condition) {
  // block of code
}
\`\`\`

For example:

\`\`\`typescript
let i: number = 1;
while (i <= 10) {
  console.log(\`Is \${i} even or odd?\`);
  if (i % 2 === 0) {
    console.log(\`\${i} is even.\`);
  } else {
    console.log(\`\${i} is odd.\`);
  }
  console.log("---");
  i++;
}
\`\`\`

#### Infinite loop

If the condition never becomes \`nr: false\`, the loop will run forever. This is called an infinite loop.

Here is an example of an infinite loop (don't try to run it; it will never finish and your browser will freeze and stop responding!):

\`\`\`typescript
nr:
while (true) {
  console.log("This will run forever!");
}
\`\`\`

### \`nr: while (true)\` with \`nr: break\`

A \`nr: while (true)\` loop runs a block of code over and over until you break out of it with \`nr: break\`:

\`\`\`typescript
nr:
while (true) {
  // block of code
  if (condition_to_stop) {
    break;
  }
}
\`\`\`

If you don't ever break out of a \`nr: while (true)\` loop, it will run forever.

### \`nr: for\` loop

The for loop runs a block of code for a specified number of iterations:

\`\`\`typescript
nr:
for (initialization; condition; increment) {
  // block of code
}
\`\`\`

For example:

\`\`\`typescript
for (let i: number = 4; i < 8; i++) {
  console.log(i);
}
\`\`\`

### \`nr: for...of\` loop

The for...of loop runs a block of code for each item in an iterable (like an array):

\`\`\`typescript
nr:
for (const item of iterable) {
  // block of code
}
\`\`\`

For example:

\`\`\`typescript
const fruits: string[] = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}
\`\`\`

### Special rules in TypeScript

- \`nr: break\` exits the loop immediately; \`nr: continue\` skips to the next iteration.
- \`nr: for...in\` loops over object keys; \`nr: for...of\` loops over iterable values.
- TypeScript provides type safety for loop variables and iterables.

## Iteration

One of the most common patterns in any programming language is to loop through a collection of items and perform some action on each item.

For example:

\`\`\`typescript
const names: string[] = ["Alice", "Bob", "Charlie"];
let i: number = 0;
while (i < names.length) {
  const name: string = names[i];
  console.log(\`Hello, \${name}!\`);
  i++;
}
\`\`\`

This pattern of looping through a collection of items and performing some action on each item is called iteration.

Most programming languages have features that make it easy to iterate through a collection without using a manual index.

For example:

\`\`\`typescript
const names: string[] = ["Alice", "Bob", "Charlie"];
for (const name of names) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Transforming a collection

Another very common pattern is to transform a collection of items into another collection of items.

For example, you can use a loop to transform an array of items into another array of items:

\`\`\`typescript
// title: Transforming an array of items into another array with a loop
const names: string[] = ["Alice", "Bob", "Charlie"];
let i: number = 0;
const upperCaseNames: string[] = [];
while (i < names.length) {
  const name: string = names[i];
  upperCaseNames.push(name.toUpperCase());
  i++;
}
upperCaseNames;
\`\`\`

Instead of using a loop to transform one array into another array, we can use the \`nr: map\` method:

\`\`\`typescript
// title: Transforming an array of items into another array with map
const names: string[] = ["Alice", "Bob", "Charlie"];
const upperCaseNames: string[] = names.map((name: string) => name.toUpperCase());
upperCaseNames;
\`\`\`

### Filtering a collection

When we want to pick out certain items from a collection, we call that filtering.

For example, if we say "pick out all the red M&Ms from the bag", we are filtering the M&Ms by color:
- we are selecting the red M&Ms

We can filter a collection with a loop by creating a new collection and adding only the items from the original collection that match our condition:

For example:

\`\`\`typescript
// title: Filtering an array of items with a loop
const names: string[] = ["Alice", "Bill", "Bob", "Charlie"];
const namesThatStartWithUpperCaseB: string[] = [];
for (const name of names) {
  if (name.startsWith("B")) {
    namesThatStartWithUpperCaseB.push(name);
  }
}
namesThatStartWithUpperCaseB;
\`\`\`

Instead of using a loop, we can use the \`nr: filter\` method to grab only the items that match a condition:

\`\`\`typescript
// title: Filtering an array of items with filter
const names: string[] = ["Alice", "Bill", "Bob", "Charlie"];
const namesThatStartWithUpperCaseB: string[] = names.filter((name: string) => name.startsWith("B"));
namesThatStartWithUpperCaseB;
\`\`\`

We can also filter to grab everything except the items that match a condition:

\`\`\`typescript
// title: Rejecting items with filter
const names: string[] = ["Alice", "Bob", "Charlie"];
const namesThatDoNotStartWithUpperCaseB: string[] = names.filter((name: string) => !name.startsWith("B"));
namesThatDoNotStartWithUpperCaseB;
\`\`\`

### Searching for an item in a collection

We can use a loop to search for an item in a collection, but there are built-in methods that make it easy in TypeScript.

For example, if we have an array of numbers and we want to find the first number greater than 100, we could use a loop to do that, like this:

\`\`\`typescript
// title: Searching for an item in a collection with a loop
const numbers: number[] = [5, 80, 138, 1, 36, 101];
let i: number = 0;
let firstNumberGreaterThan100: number | null = null;
while (i < numbers.length) {
  const number: number = numbers[i];
  if (number > 100) {
    firstNumberGreaterThan100 = number;
    break;
  }
  i++;
}
firstNumberGreaterThan100;
\`\`\`

Instead of a loop, we can use \`nr: find\` to find the first item that matches a condition:

\`\`\`typescript
// title: Searching for an item in a collection with find
const numbers: number[] = [5, 80, 138, 1, 36, 101];
const firstNumberGreaterThan100: number | undefined = numbers.find((number: number) => number > 100);
firstNumberGreaterThan100;
\`\`\`

`,
    previousSection: 'conditionals',
    nextSection: 'classes-and-objects',
  },
  {
    id: 'classes-and-objects',
    title: 'Classes and Objects',
    order: 11,
    content: `Most popular languages let you organize your program in a way that mirrors or resembles the real world.

This style of organization uses classes and objects to model real-world things. We call this style of organization object-oriented programming.

- If we want to simulate a car, we can create a class called Car and an object called \`nr: my_car\`.
- If we want to simulate a person, we can create a class called Person and an object called \`nr: my_brother\`.

To understand classes and objects, let's think of a car.

There are certain things a car can do:
- drive forward
- drive backward
- turn left
- turn right
- go faster
- go slower

And there are certain things that a car has:
- color
- a number of seats
- the car's current speed
- the car's current steering angle

A class is like a factory that knows how to build cars. You can tell the factory to build 100 cars and it will create 100 cars for you. You get to tell the factory what kind of car to make, and it will make it for you.

Each car that the factory makes is different from the others. Each car is an example of an object. An object is also called an instance of a class.

Classes describe the design of a thing, and they are used to create objects.

## Classes

A class is a blueprint or a design plan for a thing in the real world.

There are certain things a car can do:
- drive forward
- drive backward
- turn left
- turn right
- go faster
- go slower

And there are certain things that a car has:
- color
- a number of seats
- the car's current speed
- the car's current steering angle

A class lets us represent the car's behavior — the things it can do — and the car's attributes — the characteristics that a car has.

We describe a class's behavior with functions that belong to the class, called methods.

We describe a class's attributes with variables that belong to the class, called instance properties.

Here's an example of a class that represents a car:

\`\`\`typescript
// title: Defining a Car class
class Car {
  static carsProduced: number = 0

  static buildMany(n: number, options: { color: string; topSpeed?: number; seats?: number; weight?: number; gasTank?: number } = { color: 'white' }) {
    const instances: Car[] = []
    for (let i = 0; i < n; i++) instances.push(new Car(options))
    return instances
  }

  color: string
  topSpeed: number
  seats: number
  weight: number
  gasTank: number
  speed: number
  heading: number
  steeringAngle: number

  constructor({ color, topSpeed = 100, seats = 4, weight = 3000, gasTank = 12 }: { color: string; topSpeed?: number; seats?: number; weight?: number; gasTank?: number }) {
    this.color = color
    this.topSpeed = topSpeed
    this.seats = seats
    this.weight = weight
    this.gasTank = gasTank
    this.speed = 0
    this.heading = 0
    this.steeringAngle = 0
    Car.carsProduced += 1
  }

  goFaster(delta: number): void {
    this.speed = Math.min(this.speed + delta, this.topSpeed)
  }

  slowDown(delta: number): void {
    this.speed = Math.max(this.speed - delta, 0)
  }

  driveForward(): void {
    this.heading = (this.heading + this.steeringAngle) % 360
  }

  turnLeft(relativeAngle: number = 15): void {
    this.steeringAngle = -relativeAngle
  }

  turnRight(relativeAngle: number = 15): void {
    this.steeringAngle = relativeAngle
  }

  info(): string {
    return \`Car(color=\${this.color}, speed=\${this.speed}, top_speed=\${this.topSpeed}, heading=\${this.heading}, steering_angle=\${this.steeringAngle}, seats=\${this.seats})\`
  }
}
\`\`\`

A class is kind of like a factory that knows how to build cars. You can tell the factory to build 100 cars and it will create 100 cars for you. You get to tell the factory what kind of car to make, and it will make it for you.

You can see that the class has two primary things:
- instance properties that are accessed with \`nr: this.\` (for example, \`nr: this.color\`)
- methods that are defined inside the class (for example, \`nr: goFaster\` and \`nr: turnLeft\`)

The instance properties are special variables that belong to each object that is created from the class.

The methods are special functions that can change the instance properties of the object.

## Objects

We can use our Car class to create car objects, like this:

\`\`\`typescript
// title: Car as a class — attributes and behaviors

// Build two different cars (two different objects)
const red  = new Car({ color: "red",  topSpeed: 120, seats: 5, weight: 3200, gasTank: 15 })
const blue = new Car({ color: "blue", topSpeed:  90, seats: 2, weight: 2500, gasTank: 10 })
Car.carsProduced
---
// Each object keeps its own data and can do things independently
red.goFaster(20)
red.driveForward()
red.info()
---
blue.goFaster(10)
blue.turnLeft()
blue.info()
---
// They are two different objects
red === blue
---
// Our "factory" can build many cars at once
const cars = Car.buildMany(3, { color: "white" })
cars.length
\`\`\`

As you run the example code in the REPL, you can see that each object keeps track of its own color, speed, heading, and steering angle.

You can also see that each object can do things without affecting the other objects.

For example, when we call the \`nr: goFaster\` method on the \`nr: red\` object, it only affects the \`nr: red\` object's speed, not the \`nr: blue\` object's speed.
`,
    previousSection: 'loops',
    nextSection: 'types',
  },
  {
    id: 'next-steps',
    title: 'Next Steps',
    order: 13,
    content: `You're off to a great start. Here are some suggested next steps:

  ### Practice
  - Implement small utilities using variables, functions, and conditionals.

  ### Learn more (Resources)
  - Big-O notation explained clearly: [Big O by Sam Rose](https://samwho.dev/big-o/)

  ### Where to go next
  - Explore types, generics, and tooling (tsc, eslint, jest).`,
    previousSection: 'types',
  },
]
