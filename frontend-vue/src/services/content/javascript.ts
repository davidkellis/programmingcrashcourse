import type { TutorialSection } from '@/types'

export const JAVASCRIPT_TUTORIAL_SECTIONS: TutorialSection[] = [
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

\`\`\`javascript
function say_hello(name) {
  console.log("Hello " + name);
}

say_hello("Joe");
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
            language: 'javascript',
            isExecutable: true,
            context: 'Print a greeting',
          },
          {
            id: 'intro_g1_s2',
            code: 'let x = 41',
            language: 'javascript',
            isExecutable: true,
            context: 'Create a variable',
          },
          {
            id: 'intro_g1_s3',
            code: 'x + 1',
            language: 'javascript',
            isExecutable: true,
            context: 'Use the variable defined earlier',
          },
        ],
      },
      {
        id: 'intro_single_snippet',
        code: '[1, 2, 3].reduce((a, b) => a + b, 0)',
        language: 'javascript',
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
* comments are ignored by the JavaScript interpreter

\`\`\`javascript
// this line is a comment
// everything to the right of a // symbol is a comment and is ignored by the JavaScript interpreter

// Let's see what happens when we run some actual code with comments
const message = "Hello from JavaScript!"; // this comment explains what this line does
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
    content: `Values are the basic pieces of data that programs read, store, and manipulate. In JavaScript, the most common kinds of values are numbers, strings, booleans, arrays, maps (Map instances), and objects (instances of classes).

These various kinds of values are also called "types". We will learn about sets and types in detail in the [Sets and Types](/section/types) section.

### Numbers

- Used for counting, math, measuring quantities like time or cost.
- JavaScript has a single numeric type: \`nr: number\`.
- Use underscores instead of commas for readability: \`nr: 1_000_000\`.

[[snippet-group:values_numbers_group]]

### Strings

- Represent text like names, messages, file paths.

[[snippet-group:values_strings_group]]

### Booleans (boolean)

- Truth values for decisions and conditions: \`nr: true\`, \`nr: false\`.

[[snippet-group:values_booleans_group]]

### Arrays (array)

- Ordered collections of items; can mix types; can be empty.

[[snippet-group:values_arrays_group]]

### Maps (Map)

- Key/value collections with predictable iteration order. Keys can be of any type.

[[snippet-group:values_maps_group]]

### Objects (instances of classes)

- Real‑world entities with properties and methods.

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
          { id: 'values_numbers_s1', code: '42', language: 'javascript', isExecutable: true, context: 'An integer literal' },
          { id: 'values_numbers_s2', code: '1_000_000', language: 'javascript', isExecutable: true, context: 'Readable integer with underscores' },
          { id: 'values_numbers_s3', code: '3.141592653589793', language: 'javascript', isExecutable: true, context: 'A float literal' },
          { id: 'values_numbers_s4', code: '-7', language: 'javascript', isExecutable: true, context: 'A negative integer' },
        ],
      },
      {
        id: 'values_strings_group',
        title: 'Strings — literal values',
        description: 'Evaluate string literals.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_strings_s1', code: '"Hello, world!"', language: 'javascript', isExecutable: true, context: 'Double-quoted string' },
          { id: 'values_strings_s2', code: '\'JavaScript is fun\'', language: 'javascript', isExecutable: true, context: 'Single-quoted string' },
          { id: 'values_strings_s3', code: '"😀 emojis are text, too"', language: 'javascript', isExecutable: true, context: 'Unicode string' },
        ],
      },
      {
        id: 'values_booleans_group',
        title: 'Booleans — true/false',
        description: 'Evaluate the two boolean values.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_booleans_s1', code: 'true', language: 'javascript', isExecutable: true, context: 'Boolean true' },
          { id: 'values_booleans_s2', code: 'false', language: 'javascript', isExecutable: true, context: 'Boolean false' },
        ],
      },
      {
        id: 'values_arrays_group',
        title: 'Arrays — literal values',
        description: 'Evaluate array literals of different shapes.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_arrays_s1', code: '[1, 3, 5, 7, 9]', language: 'javascript', isExecutable: true, context: 'A list of numbers' },
          { id: 'values_arrays_s2', code: '["apples", "bananas", "cherries"]', language: 'javascript', isExecutable: true, context: 'A list of strings' },
          { id: 'values_arrays_s3', code: '[1000, "cookies", true]', language: 'javascript', isExecutable: true, context: 'A mixed array' },
          { id: 'values_arrays_s4', code: '[] // empty array', language: 'javascript', isExecutable: true, context: 'An empty array' },
        ],
      },
      {
        id: 'values_maps_group',
        title: 'Maps — Map instances',
        description: 'Construct Map instances with different key types.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_maps_s1', code: 'new Map([[1, "one"], [2, "two"], [3, "three"]])', language: 'javascript', isExecutable: true, context: 'Integer keys' },
          { id: 'values_maps_s2', code: 'new Map([["Jack", "Cookies"], ["Jill", "Ice Cream"], ["Phil", "Asparagus"]])', language: 'javascript', isExecutable: true, context: 'String keys' },
        ],
      },
      {
        id: 'values_objects_group',
        title: 'Objects — class instances',
        description: 'Define a class, create an instance, and evaluate it.',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: [
          { id: 'values_objects_s1', code: 'class Dog { constructor(name) { this.name = name } }', language: 'javascript', isExecutable: true, context: 'Define a class' },
          { id: 'values_objects_s2', code: 'const my_dog = new Dog("Max")', language: 'javascript', isExecutable: true, context: 'Instantiate the class' },
          { id: 'values_objects_s3', code: 'my_dog', language: 'javascript', isExecutable: true, context: 'Evaluate the instance' },
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
    content: `Operators combine or transform values to produce new values. You'll use them constantly with numbers, strings, arrays, and booleans.

### Arithmetic operators (numbers)

- Addition: \`nr: +\`
- Subtraction: \`nr: -\`
- Multiplication: \`nr: *\`
- Division: \`nr: /\`
- Remainder (modulo): \`nr: %\`
- Exponent: \`nr: **\`

\`\`\`javascript
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

\`\`\`javascript
3 == '3'
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

\`\`\`javascript
true && false
true || false
! (2 < 3)
\`\`\`

### Working with strings and arrays

- Concatenation (strings): \`nr: +\`
- Repetition (strings): \`nr: 'ha'.repeat(3)\`
- Membership: \`nr: 'javascript'.includes('script')\`, \`nr: [1,2,3].includes(2)\`
- Indexing: \`nr: str[i]\`, \`nr: arr[i]\`
- Slicing: \`nr: str.slice(start, end)\`, \`nr: arr.slice(start, end)\`

\`\`\`javascript
"Hi, " + "there"
"ha".repeat(3)
"javascript".includes("script")
[1, 2].concat([3])
[0, 0, 0, 0]
[1,2,3,4].slice(1,3)
\`\`\`

### Precedence and grouping

- Parentheses \`nr: ( )\` change evaluation order.
- JavaScript precedence (high → low): \`nr: **\`, \`nr: * / %\`, \`nr: + -\`, comparisons, \`nr: !\`, \`nr: &&\`, \`nr: ||\`.

\`\`\`javascript
1 + 2 * 3
(1 + 2) * 3
\`\`\`

You now know the basic operators; next you'll use them with variables and assignments.
`,
    codeSnippets: [],
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

\`\`\`javascript
let my_age = 10
let my_age_next_year = my_age + 1
my_age_next_year
\`\`\`

Finally, we can change the value that a variable points at by assigning a new value to the variable:

\`\`\`javascript
let my_age = 10
console.log(` + "`my_age -> ${my_age}`" + `)   // this prints 10
my_age = 11
console.log(` + "`my_age -> ${my_age}`" + `)   // this prints 11
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
  * \`123\` - number literals
  * \`true\` - boolean literals
  * \`"Max"\` - string literals
  * \`[1, 2, 3]\` - array literals
  * \`new Map([[1, "one"], [2, "two"]])\` - map construction expressions (Map)
* assignment expressions
  * \`my_age = 25\`
  * \`what_i_ate_for_breakfast = "cereal"\`
* variable evaluation expressions
  * \`my_age\`
* function definition expressions
* function invocation expressions
* conditional expressions
* loop expressions

These common kinds of expression are what we are focusing on in this tutorial, because every language has them, so if you know what an assignment expression looks like in JavaScript, then you know what it looks like in most every language.

### Comparison expressions

Comparison expressions evaluate to a boolean (\`nr: true\` or \`nr: false\`).

Try these:

\`\`\`javascript
1 == 1
1 != 2
3 < 5
5 <= 5
7 > 2
2 >= 9
\`\`\`

Note: JavaScript also has strict equality operators \`===\` and \`!==\` which do not perform type coercion.

\`\`\`javascript
3 == "3"   // true (loose equality with coercion)
3 === 3    // true (strict equality)
3 === "3"  // false (no coercion)
\`\`\`

### Boolean logic expressions

Use \`nr: &&\`, \`nr: ||\`, and \`nr: !\` to combine or negate boolean values.

\`\`\`javascript
true && true
true && false
true || false
false || false
!true
!(1 < 2)
\`\`\`

Short-circuiting: in \`nr: A && B\`, if \`nr: A\` is false, JavaScript does not evaluate \`nr: B\`. In \`nr: A || B\`, if \`nr: A\` is true, JavaScript does not evaluate \`nr: B\`.

### Grouping and operator precedence

Parentheses \`nr: ( )\` change evaluation order. Arithmetic has the usual precedence (\`nr: * / %\` before \`nr: + -\`), then comparisons, then \`nr: !\`, then \`nr: &&\`, then \`nr: ||\`.

\`\`\`javascript
1 + 2 * 3
(1 + 2) * 3
10 - 4 - 1
10 - (4 - 1)
(2 < 3) && (3 < 5)
\`\`\`

### String expressions

\`nr: +\` concatenates strings; \`nr: 'ha'.repeat(3)\` repeats them.

\`\`\`javascript
"Hello, " + "world!"
"ha".repeat(3)
const name = "Sam"
"Hello, " + name
\`\`\`

### Array expressions

Arrays support concatenation and size queries.

\`\`\`javascript
[1, 2].concat([3, 4])
Array(5).fill(0)
[1, 2, 3].length
\`\`\`

### Indexing and slicing

Use square brackets to get elements, and \`slice(start, end)\` to get subarrays or substrings.

\`\`\`javascript
const letters = ["a", "b", "c", "d", "e"]
letters[0]
letters[letters.length - 1]
letters.slice(1, 4)
letters.slice(0, 3)
letters.filter((_, i) => i % 2 === 0)  // every other element

const text = "javascript"
text[0]
text[text.length - 1]
text.slice(1, 4)
text.split("").reverse().join("")
\`\`\`

### Membership

Use \`nr: includes\` to test membership in arrays and substrings in strings.

\`\`\`javascript
[1, 2, 3].includes(3)
"python".includes("py")
![1, 2, 3].includes(9)
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

A function in JavaScript is similar. Here is a function for printing a message:

\`\`\`javascript
function print_hello() {
  console.log("Hello");
}
\`\`\`

This function has a name (\`print_hello\`) and a list of instructions to follow (print "Hello").

Functions can also accept parameters (inputs). Here is a function that accepts one parameter:

\`\`\`javascript
function print_my_age(age) {
  console.log("I am", age, "years old");
}
\`\`\`

This function has no parameters:

\`\`\`javascript
function print_hello() {
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

Here is what this looks like in the JavaScript REPL:

\`\`\`
> function print_hello() {
...   console.log("Hello");
... }
undefined
> print_hello()
Hello
undefined
> function print_my_age(age) {
...   console.log("I am", age, "years old");
... }
undefined
> print_my_age(8)
I am 8 years old
undefined
\`\`\`

Functions can also return values. Here is a function that returns a value:

\`\`\`
> function add_five(value) {
...   return value + 5;
... }
undefined
> let three_plus_five = add_five(3);
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
    id: 'types',
    title: 'Sets and Types',
    order: 11,
    content: `## Sets
A set is a collection of unique values. Think of it as a bag where each distinct element appears at most once.
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
  <path id="tinyNumberPath_js" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#tinyNumberPath_js" startOffset="50%" text-anchor="middle">TinyNumber</textPath>
  </text>
  <text x="90" y="90" fill="#FFFFFF" font-size="18">1</text>
  <text x="110" y="110" fill="#FFFFFF" font-size="18">2</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">3</text>
</svg>

* We could give the name **DogName** to the set \`nr: ["Max", "Ace", "Tiny"]\`
   * The type **DogName** is the set of values \`nr: ["Max", "Ace", "Tiny"]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
  <path id="dogNamePath_js" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#dogNamePath_js" startOffset="50%" text-anchor="middle">DogName</textPath>
  </text>
  <text x="80" y="90" fill="#FFFFFF" font-size="18">"Max"</text>
  <text x="85" y="110" fill="#FFFFFF" font-size="18">"Ace"</text>
  <text x="85" y="130" fill="#FFFFFF" font-size="18">"Tiny"</text>
</svg>


* We could name the set \`nr: [99, 100, 101]\` **AgeOfAnOldPerson**
   * The type **AgeOfAnOldPerson** is the set of values \`nr: [99, 100, 101]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#9C27B0" stroke="#000" stroke-width="2"/>
  <path id="ageOfAnOldPersonPath_js" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#ageOfAnOldPersonPath_js" startOffset="50%" text-anchor="middle">AgeOfAnOldPerson</textPath>
  </text>
  <text x="85" y="90" fill="#FFFFFF" font-size="18">99</text>
  <text x="95" y="110" fill="#FFFFFF" font-size="18">100</text>
  <text x="90" y="130" fill="#FFFFFF" font-size="18">101</text>
</svg>

* We could say **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`
   * The type **SmallOddNumber** is the set \`nr: [1, 3, 5, 7, 9]\`

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#F44336" stroke="#000" stroke-width="2"/>
  <path id="smallOddNumberPath_js" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#smallOddNumberPath_js" startOffset="50%" text-anchor="middle">SmallOddNumber</textPath>
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
  <path id="intPath_js" d="M 20 100 A 80 80 0 1 1 180 100" fill="none"/>
  <text fill="#000">
    <textPath href="#intPath_js" startOffset="50%" text-anchor="middle">WholeNumber</textPath>
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

In JavaScript, there is a type called \`nr: number\` that is the set of all numbers:

* \`nr: [..., -10.1, -2.0, -1.6, 0.0, 0.5, 1.0, 2.8, 3.1, 1000.0, ...]\`

JavaScript has a bunch of built-in types and core objects:

* \`nr: undefined\`
* \`nr: null\`
* \`nr: boolean\`
* \`nr: number\`
* \`nr: string\`
* \`nr: bigint\`
* \`nr: symbol\`
* \`nr: object\`
* \`nr: function\`
* \`nr: Array\`
* and many more
`,
    codeSnippets: [],
    previousSection: 'conditionals',
    nextSection: 'next-steps',
  },
  {
    id: 'next-steps',
    title: 'Next Steps',
    order: 12,
    content: `You're off to a great start. Here are some suggested next steps:

  ### Practice
  - Build tiny scripts that use variables, functions, and conditionals.

  ### Learn more (Resources)
  - Big-O notation explained clearly: [Big O by Sam Rose](https://samwho.dev/big-o/)

  ### Where to go next
  - Learn loops, arrays/objects methods, async/await, and modules.`,
    codeSnippets: [],
    previousSection: 'types',
  },
]
