import type { TutorialSection } from '@/types'

export const TYPESCRIPT_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome!

This is a programming tutorial that aims to teach you how to read and write code in the most widely used programming languages: C, C++, C#, Java, Scala, Kotlin, Groovy, JavaScript, TypeScript, Go, Nim, Rust, etc.

Most of the widely used languages look and behave very similarly. They are all [imperative languages](https://en.wikipedia.org/wiki/Imperative_programming). They are so similar that if you know one, you almost know them all.

Throughout the tutorial you'll see short inline code snippets illustrated like \`nr: this\`. Some inline snippets have a green Run button with a little arrow like ➤, for example: \`1+2\`. Click the Run button with the arrow ➤ to evaluate it in the REPL (read–evaluate–print loop) docked to the side or bottom of the page.

You'll see groups of snippets like this:

[[snippet-group:intro_group_hello_vars]]

[[snippet:intro_single_snippet]]

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
    codeSnippets: [],
    codeItems: [
      {
        id: 'intro_group_hello_vars',
        title: 'Warm-up: Hello and Variables',
        description: 'Run these in order to see how the REPL keeps state between snippets.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          {
            id: 'intro_g1_s1',
            code: "console.log('Hello from a grouped snippet!')",
            language: 'typescript',
            isExecutable: true,
            context: 'Print a greeting',
          },
          {
            id: 'intro_g1_s2',
            code: 'let x: number = 41',
            language: 'typescript',
            isExecutable: true,
            context: 'Create a variable',
          },
          {
            id: 'intro_g1_s3',
            code: 'x + 1',
            language: 'typescript',
            isExecutable: true,
            context: 'Use the variable defined earlier',
          },
        ],
      },
      {
        id: 'intro_single_snippet',
        code: '[1, 2, 3].reduce((a, b) => a + b, 0)',
        language: 'typescript',
        isExecutable: true,
        context: 'A single snippet alongside a group',
      },
    ],
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
    codeSnippets: [],
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

[[snippet-group:values_numbers_group]]

### Strings

- What they are used for: representing text like names, messages, file paths, and any human‑readable data.
- Features: written with quotes, can include spaces and punctuation, support Unicode.

[[snippet-group:values_strings_group]]

### Booleans (boolean)

- What they are used for: representing truth values for decisions, conditions, and flags.
- Values: \`nr: true\` and \`nr: false\`.

[[snippet-group:values_booleans_group]]

### Arrays (Array)

- What they are used for: ordered collections of items; great for sequences like to‑do items, scores, or search results.
- Features: can hold values of any type, can be empty, can be nested.

[[snippet-group:values_arrays_group]]

### Maps (Map)

- What they are used for: mapping keys to values; great for lookups, configurations, and records.
- Features: keys must be unique; keys can be of any type; preserves insertion order.

[[snippet-group:values_maps_group]]

### Class instances (instances of classes)

- What they are used for: representing real‑world things with data (properties) and behavior (methods), like a \`Dog\`, \`Car\`, or \`BankAccount\`.
- Example: creating an instance of a simple class.

[[snippet-group:values_objects_group]]

You will use these values inside expressions, assignments, function calls, and conditionals in the rest of this tutorial.`,
    codeSnippets: [],
    codeItems: [
      {
        id: 'values_numbers_group',
        title: 'Numbers — literal values',
        description: 'Evaluate number literals.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_numbers_s1', code: '42', language: 'typescript', isExecutable: true, context: 'An integer literal' },
          { id: 'values_numbers_s2', code: '1_000_000', language: 'typescript', isExecutable: true, context: 'Readable integer with underscores' },
          { id: 'values_numbers_s3', code: '3.141592653589793', language: 'typescript', isExecutable: true, context: 'A float literal' },
          { id: 'values_numbers_s4', code: '-7', language: 'typescript', isExecutable: true, context: 'A negative integer' },
        ],
      },
      {
        id: 'values_strings_group',
        title: 'Strings — literal values',
        description: 'Evaluate string literals.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_strings_s1', code: '"Hello, world!"', language: 'typescript', isExecutable: true, context: 'Double-quoted string' },
          { id: 'values_strings_s2', code: '\'TypeScript is fun\'', language: 'typescript', isExecutable: true, context: 'Single-quoted string' },
          { id: 'values_strings_s3', code: '"😀 emojis are text, too"', language: 'typescript', isExecutable: true, context: 'Unicode string' },
        ],
      },
      {
        id: 'values_booleans_group',
        title: 'Booleans — true/false',
        description: 'Evaluate the two boolean values.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_booleans_s1', code: 'true', language: 'typescript', isExecutable: true, context: 'Boolean true' },
          { id: 'values_booleans_s2', code: 'false', language: 'typescript', isExecutable: true, context: 'Boolean false' },
        ],
      },
      {
        id: 'values_arrays_group',
        title: 'Arrays — literal values',
        description: 'Evaluate array literals of different shapes.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_arrays_s1', code: '[1, 3, 5, 7, 9]', language: 'typescript', isExecutable: true, context: 'A list of numbers' },
          { id: 'values_arrays_s2', code: '["apples", "bananas", "cherries"]', language: 'typescript', isExecutable: true, context: 'A list of strings' },
          { id: 'values_arrays_s3', code: '[1000, "cookies", true]', language: 'typescript', isExecutable: true, context: 'A mixed array' },
          { id: 'values_arrays_s4', code: '[]  // an empty array', language: 'typescript', isExecutable: true, context: 'An empty array' },
        ],
      },
      {
        id: 'values_maps_group',
        title: 'Maps — Map instances',
        description: 'Construct Map instances with different key types.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_maps_s1', code: 'new Map([[1, "one"], [2, "two"], [3, "three"]])', language: 'typescript', isExecutable: true, context: 'Integer keys' },
          { id: 'values_maps_s2', code: 'new Map([["Jack", "Cookies"], ["Jill", "Ice Cream"], ["Phil", "Asparagus"]])', language: 'typescript', isExecutable: true, context: 'String keys' },
        ],
      },
      {
        id: 'values_objects_group',
        title: 'Objects — class instances',
        description: 'Define a class, create an instance, and evaluate it.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_objects_s1', code: 'class Dog {\n  constructor(public name: string) {}\n}', language: 'typescript', isExecutable: true, context: 'Define a class' },
          { id: 'values_objects_s2', code: 'const my_dog = new Dog("Max")', language: 'typescript', isExecutable: true, context: 'Instantiate the class' },
          { id: 'values_objects_s3', code: 'my_dog', language: 'typescript', isExecutable: true, context: 'Evaluate the instance' },
        ],
      },
    ],
    previousSection: 'comments',
    nextSection: 'operators',
  },
  {
    id: 'operators',
    title: 'Operators',
    order: 4,
    content: `Operators combine or transform values to produce new values. You will use them constantly with numbers, strings, arrays, and booleans.

### Arithmetic operators (numbers)

- Addition: \`nr: +\`
- Subtraction: \`nr: -\`
- Multiplication: \`nr: *\`
- Division: \`nr: /\`
- Remainder (modulo): \`nr: %\`
- Exponent: \`nr: **\`

\`\`\`typescript
1 + 2
7 - 3
4 * 5
9 / 2
9 % 2
2 ** 3
\`\`\`

### Comparison operators (booleans)

- Equal: \`nr: ==\`  |  Not equal: \`nr: !=\`
- Strict equal: \`nr: ===\`  |  Strict not equal: \`nr: !==\`
- Less than / less than or equal: \`nr: <\`, \`nr: <=\`
- Greater than / greater than or equal: \`nr: >\`, \`nr: >=\`

\`\`\`typescript
3 == 3
3 === 3
3 != 4
2 < 5
5 <= 5
7 > 1
7 >= 10
\`\`\`

### Boolean operators

- And: \`nr: &&\`  |  Or: \`nr: ||\`  |  Not: \`nr: !\`
- Short‑circuit: \`A && B\` skips \`B\` if \`A\` is false; \`A || B\` skips \`B\` if \`A\` is true.

\`\`\`typescript
true && false
true || false
!(2 < 3)
\`\`\`

### Sequence operators (strings and arrays)

- Strings: concatenation with \`nr: +\`, repetition with \`nr: "ha".repeat(3)\`.
- Arrays: concatenate with \`nr: arr1.concat(arr2)\` or spread \`nr: [...arr1, ...arr2]\`.
- Membership: \`nr: "py".includes("p")\`, \`nr: [1,2,3].includes(2)\`.

\`\`\`typescript
"Hi, " + "there"
"ha".repeat(3)
[1, 2].concat([3])
[...['a', 'b'], ...['c']]
"python".includes("py")
[1,2,3].includes(2)
\`\`\`

### Precedence and grouping

- Parentheses \`nr: ( )\` change evaluation order.
- Precedence (high → low): \`nr: **\`, \`nr: * / %\`, \`nr: + -\`, comparisons, \`nr: !\`, \`nr: &&\`, \`nr: ||\`.

\`\`\`typescript
1 + 2 * 3
(1 + 2) * 3
\`\`\`

You now know the basic operators; next you will use them with variables and assignments.
`,
    codeSnippets: [],
    previousSection: 'values',
    nextSection: 'variables',
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
    codeSnippets: [],
    previousSection: 'conditionals',
    nextSection: 'next-steps',
  },
  {
    id: 'variables',
    title: 'Variables and Assignment',
    order: 6,
    content:
      `A variable is a name that points at a particular value. For example:

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

\`\`\`typescript
let my_age: number = 10
let my_age_next_year: number = my_age + 1
my_age_next_year
\`\`\`

Finally, we can change the value that a variable points at by assigning a new value to the variable:

\`\`\`typescript
let my_age: number = 10
console.log(` +
      '`my_age -> ${my_age}`' +
      `)   // this prints 10
my_age = 11
console.log(` +
      '`my_age -> ${my_age}`' +
      `)   // this prints 11
\`\`\`

`,
    codeSnippets: [],
    previousSection: 'operators',
    nextSection: 'expressions',
  },
  {
    id: 'expressions',
    title: 'Expressions',
    order: 7,
    content: `So far, we have seen several different kinds of expression:

* value literal expressions
  * \`123\` - number literal expressions
  * \`3.14159\` - number literal expressions
  * \`true\` - boolean literal expressions
  * \`"Max"\` - string literal expressions
  * \`[1, 2, 3, 1, 2, 3]\` - array literal expressions
  * \`new Map([[1, "one"], [2, "two"]])\` - map construction expressions (Map)
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

These common kinds of expression are what we are focusing on in this tutorial, because every language has them, so if you know what an assignment expression looks like in Python, then you know what it looks like in most every language.

### Comparison expressions

Comparison expressions evaluate to a boolean (\`nr: true\` or \`nr: false\`).

Try these:

\`\`\`typescript
3 === 3
3 !== 4
2 < 5
5 <= 5
7 > 2
2 >= 9
\`\`\`

### Boolean logic expressions

Use \`nr: &&\`, \`nr: ||\`, and \`nr: !\` to combine or negate boolean values.

\`\`\`typescript
true && true
true && false
true || false
false || false
!true
!(1 < 2)
\`\`\`

Short-circuiting: in \`nr: A && B\`, if \`nr: A\` is false, JavaScript/TypeScript does not evaluate \`nr: B\`. In \`nr: A || B\`, if \`nr: A\` is true, it does not evaluate \`nr: B\`.

### Grouping and operator precedence

Parentheses \`nr: ( )\` change evaluation order. Arithmetic has the usual precedence (\`nr: * / %\` before \`nr: + -\`), then comparisons, then \`nr: !\`, then \`nr: &&\`, then \`nr: ||\`.

\`\`\`typescript
1 + 2 * 3
(1 + 2) * 3
10 - 4 - 1
10 - (4 - 1)
(2 < 3) && (3 < 5)
\`\`\`

### String expressions

\`nr: +\` concatenates strings; \`nr: "ha".repeat(3)\` repeats them. Template literals interpolate values.

\`\`\`typescript
"Hello, " + "world!"
"ha".repeat(3)
const name = "Sam"
"Hello, " + name
\`Hello, \${name}!\`
\`\`\`

### Array expressions

Arrays support concatenation and repetition‑like creation.

\`\`\`typescript
[1, 2].concat([3, 4])
[...['a', 'b'], ...['c']]
Array(5).fill(0)
[1, 2, 3].length
\`\`\`

### Indexing and slicing

Use square brackets to get elements; use \`.slice(start, end)\` for slices (end is exclusive). Works for strings and arrays.

\`\`\`typescript
const letters = ["a", "b", "c", "d", "e"]
letters[0]
letters[letters.length - 1]
letters.slice(1, 4)
letters.slice(0, 3)
letters.filter((_, i) => i % 2 === 0) // every other element

const text = "typescript"
text[0]
text[text.length - 1]
text.slice(1, 4)
text.split("").reverse().join("")
\`\`\`

### Membership

Use \`nr: includes\` to test membership in strings and arrays.

\`\`\`typescript
[1, 2, 3].includes(3)
"python".includes("py")
!([1, 2, 3].includes(9))
!"python".includes("x")
\`\`\`

These forms are the building blocks you will combine inside conditionals, loops, and function calls in the next sections.`,
    codeSnippets: [],
    previousSection: 'variables',
    nextSection: 'functions',
  },
  {
    id: 'functions',
    title: 'Functions',
    order: 8,
    content: `A function is like a recipe. A recipe has a name and a list of instructions to follow.

For example, here is a recipe for making a peanut butter sandwich:

**Make Peanut Butter Sandwich:**
1. Get two slices of bread
2. Get jar of peanut butter
3. Get a knife
4. Open the jar of peanut butter
5. Use the knife to scoop peanut butter from the jar
6. Spread the peanut butter on one slice of bread
7. Put the two slices of bread together
8. Clean the knife
9. Put away the jar of peanut butter

A function in TypeScript is similar. Here is a function for printing a message:

\`\`\`typescript
function print_hello(): void {
  console.log("Hello");
}
\`\`\`

This function has a name (\`print_hello\`), a return type (\`void\`), and a list of instructions to follow (print "Hello").

Functions can also accept parameters (inputs) with type annotations. Here is a function that accepts one parameter:

\`\`\`typescript
function print_my_age(age: number): void {
  console.log("I am", age, "years old");
}
\`\`\`

This function has no parameters:

\`\`\`typescript
function print_hello(): void {
  console.log("Hello");
}
\`\`\``,
    codeSnippets: [],
    previousSection: 'expressions',
    nextSection: 'function-invocation',
  },
  {
    id: 'function-invocation',
    title: 'Function Invocation',
    order: 9,
    content: `You can use a function by calling it, or invoking it. Calling a function is the same thing as invoking it.

A function may be called, or invoked, by typing the name of the function, followed by parenthesis. If the function was defined to accept parameters, then you must supply values for those parameters.

For example, to call the \`print_hello\` function:

\`print_hello()\`

To call the \`print_my_age\` function, we must supply a value for the \`age\` parameter:

\`print_my_age(8)\`

Here is what this looks like in the TypeScript REPL:

\`\`\`
> function print_hello(): void {
...   console.log("Hello");
... }
undefined
> print_hello()
Hello
undefined
> function print_my_age(age: number): void {
...   console.log("I am", age, "years old");
... }
undefined
> print_my_age(8)
I am 8 years old
undefined
\`\`\`

Functions can also return values with type annotations. Here is a function that returns a value:

\`\`\`
> function add_five(value: number): number {
...   return value + 5;
... }
undefined
> let three_plus_five: number = add_five(3);
undefined
> three_plus_five
8
\`\`\``,
    codeSnippets: [],
    previousSection: 'functions',
    nextSection: 'conditionals',
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 10,
    content: `The primary conditional or branching expression is the \`if\` / \`else if\` / \`else\` expression.

There are three variations:

* \`if\`
   * \`if (i_am_hungry) { console.log("I'm starving!"); }\`
* \`if\` / \`else\`
   * \`if (i_am_hungry) { console.log("I'm starving!"); } else { console.log("I am full."); }\`
* \`if\` / \`else if\` / \`else\`
   * \`if (age < 5) { console.log("You are younger than five years old."); } else if (age < 10) { console.log("You are five to nine years old."); } else { console.log("You are ten or older"); }\`

In each case, the \`if\` expression is always followed by an expression that evaluates to a boolean value.`,
    codeSnippets: [],
    previousSection: 'function-invocation',
    nextSection: 'types',
  },
  {
    id: 'next-steps',
    title: 'Next Steps',
    order: 12,
    content: `You're off to a great start. Here are some suggested next steps:

  ### Practice
  - Implement small utilities using variables, functions, and conditionals.

  ### Learn more (Resources)
  - Big-O notation explained clearly: [Big O by Sam Rose](https://samwho.dev/big-o/)

  ### Where to go next
  - Explore types, generics, and tooling (tsc, eslint, jest).`,
    codeSnippets: [],
    previousSection: 'types',
  },
]
