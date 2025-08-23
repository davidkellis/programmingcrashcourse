import type { TutorialSection } from '@/types'

export const TYPESCRIPT_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome!

This is a programing tutorial that aims to teach you how to read and write code in the most widely used programming languages: C, C++, C#, Java, Scala, Kotlin, Groovy, JavaScript, TypeScript, Go, Nim, Rust, etc.

Most of the widely used languages look and behave very similarly. They are all [imperative languages](https://en.wikipedia.org/wiki/Imperative_programming). They are so similar that if you know one, you almost know them all.

Throughout the tutorial you'll see short inline code snippets illustrated like \`nr: this\`. Some inline snippets have a green Run button with a little arrow like ➤, for example: \`1+2\`. Click the Run button with the arrow ➤ to evaluate it in the REPL (read–evaluate–print loop) docked to the side or bottom of the page.

You'll also see editable code blocks like this:

\`\`\`typescript
function say_hello(name: string): void {
  console.log("Hello " + name)
}

say_hello("Joe")
\`\`\`

Code blocks have a green Run button in the top-right. Click it to send the whole block to the REPL.

You can edit the code in the code blocks by clicking on the code and typing. When the cursor is blinking inside a code block, you can press \`nr: ctrl+enter\` to run (hold Control, press Enter) the code.

Let’s begin.`,
    codeSnippets: [],
    nextSection: 'comments'
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
    nextSection: 'values'
  },
  {
    id: 'values',
    title: 'Values',
    order: 3,
    content: `A value is either:

* a number, for example:
   * \`1\`
   * \`1.4\`
   * \`3.141592653589793\`
   * \`1000\`
   * \`1000000\`
   * \`1_000_000 // numbers may not have commas in them, but may use underscores instead\`
* a quoted string, for example:
   * \`"my name is David"\`
   * \`"I ate a sleeve of cookies"\`
   * \`"I had to exercise"\`
* a boolean true or false value, for example:
   * \`true\`
   * \`false\`
* an array of values, for example:
   * \`[1, 3, 5, 7, 9]\`
   * \`[3.141592653589793, "pi", "pie"]\`
   * \`[1000, "cookies", true]\`
   * \`[0, "cookies", false]\`
* an object is a collection of associated key/value pairs, for example:
   * \`{"1": "one", "2": "two", "3": "three"}\`
   * \`{"Jack": "Cookies", "Jill": "Ice Cream", "Phil": "Asparagus"}\`
* an instance of a class (more on this later)

Let's see how these values evaluate in the TypeScript REPL:

\`\`\`typescript
1
1.4
3.141592653589793
1000
1000000
1_000_000
"my name is David"
"I ate a sleeve of cookies"
"I had to exercise"
true
false
[1, 3, 5, 7, 9]
[3.141592653589793, "pi", "pie"]
[1000, "cookies", true]
[0, "cookies", false]
{"1": "one", "2": "two", "3": "three"}
{"Jack": "Cookies", "Jill": "Ice Cream", "Phil": "Asparagus"}
\`\`\``,
    codeSnippets: [],
    previousSection: 'comments',
    nextSection: 'sets'
  },
  {
    id: 'sets',
    title: 'Sets',
    order: 4,
    content: `A set is a collection of unique values, like the list of all the words in the dictionary. Each word appears only once.

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

* \`nr: [ 1, 3.141592653589793, "Steve", True ]\`

<div style="display: flex; justify-content: center; margin: 1em 0;">
   <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
   <circle cx="100" cy="100" r="80" fill="#2196F3" stroke="#000" stroke-width="2"/>
   <text x="85" y="90" fill="#FFFFFF" font-size="16">1</text>
   <text x="25" y="110" fill="#FFFFFF" font-size="16">3.141592653589793</text>
   <text x="90" y="130" fill="#FFFFFF" font-size="16">Steve</text>
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
`,
    codeSnippets: [],
    previousSection: 'values',
    nextSection: 'types'
  },
  {
    id: 'types',
    title: 'Types',
    order: 5,
    content: `A type is a set of values that we give a name to.

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

TypeScript has a bunch of built in types (and generics like Array<T>, Set<T>):

* **bool** (as **boolean**)
* **number**
* **string**
* **object**
* **undefined**
* **null**
* **any**
* **void**
* **Array<T>**, **Set<T>**`,
    codeSnippets: [],
    previousSection: 'sets',
    nextSection: 'variables'
  },
  {
    id: 'variables',
    title: 'Variables and Assignment',
    order: 6,
    content: `A variable is a name that points at a particular value.

There are two simple ways to think about a variable:

1. A variable is a labeled box, and we can put values in the box
2. A variable is a name tag, and we can stick the name tag on different values

For example, we can create a variable named \`my_age\` and assign the value \`25\` to it:

\`let my_age: number = 25\`

In this example, \`my_age\` is the variable name, \`number\` is the type annotation, and \`25\` is the value.

Here is what this looks like in the TypeScript REPL:

\`\`\`
> let my_age: number = 25
undefined
> my_age
25
\`\`\`

In this code snippet, we are running the TypeScript interpreter in its interactive mode (called the read-evaluate-print-loop, or REPL for short), and assigning the value \`25\` to the variable named \`my_age\` with a type annotation of \`number\`, and then we read the value stored in the \`my_age\` variable by entering the name of the variable by itself and pressing enter; the REPL shows us that the value \`25\` is currently stored in the variable named \`my_age\`.`,
    codeSnippets: [],
    previousSection: 'types',
    nextSection: 'expressions'
  },
  {
    id: 'expressions',
    title: 'Expressions',
    order: 7,
    content: `So far, we have seen several different kinds of expression:

* value literal expressions
   * \`123\` - number literal expressions
   * \`"Hello"\` - string literal expressions
   * \`true\` - boolean literal expressions
   * \`[1, 2, 3]\` - array literal expressions
* variable expressions
   * \`my_age\` - variable expressions
* assignment expressions
   * \`my_age = 25\` - assignment expressions

An expression is a piece of code that can be evaluated (or computed) to produce a value.

For example, when we evaluate the expression \`1 + 2\`, we compute the value \`3\`.

When we evaluate the expression \`my_age\`, we compute whatever value is currently stored in the variable named \`my_age\`.

When we evaluate the expression \`"Hello"\`, we compute the string value \`"Hello"\`.`,
    codeSnippets: [],
    previousSection: 'variables',
    nextSection: 'functions'
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
    nextSection: 'function-invocation'
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
    nextSection: 'conditionals'
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
    previousSection: 'function-invocation'
  }
]
