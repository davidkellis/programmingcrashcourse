import type { TutorialSection } from '@/types'

export const TYPESCRIPT_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome to TypeScript programming! This tutorial will teach you the fundamentals of TypeScript through interactive examples.

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds static type definitions to JavaScript, making your code more reliable and easier to maintain. Let's start exploring the basic building blocks of TypeScript programming.

Let's begin with your first TypeScript program:

\`\`\`typescript
console.log("Hello, World!");
console.log("Welcome to TypeScript programming!");
\`\`\``,
    codeSnippets: [],
    nextSection: 'comments'
  },
  {
    id: 'comments',
    title: 'Comments',
    order: 2,
    content: `* lines that start with // are comments
* comments are just explanations about something
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
   * \`{1: "one", 2: "two", 3: "three"}\`
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
{1: "one", 2: "two", 3: "three"}
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

This is a set of three numbers:

* \`1\`
* \`2\`
* \`3\`

This is a set of two names:

* \`"Jack"\`
* \`"Jill"\`

This is a set of different kinds of things:

* \`1\`
* \`3.141592653589793\`
* \`"Steve"\`
* \`true\`

This is **not** a set (because some values are repeated):

* \`1\`
* \`1\`
* \`3.141592653589793\`

Sets in TypeScript are created using the Set constructor with type annotations:

* \`new Set<number>([1,2,3])\`
* \`new Set<string>(["Jack", "Jill"])\`
* \`new Set<number | string | boolean>([1, 3.141592653589793, "Steve", true])\``,
    codeSnippets: [],
    previousSection: 'values',
    nextSection: 'types'
  },
  {
    id: 'types',
    title: 'Types',
    order: 5,
    content: `A type is a named set of values; it's a set that we give a name to.

We can name a set of values however we want. For example:

* We could call the set \`[1,2,3]\` **TinyNumber**
* We could call the set \`[4,5,6,7,8,9]\` **SmallNumber**
* We could call the set \`[10,11,12,13,14,15,16,17,18,19]\` **MediumNumber**

Or we could give them different names:

* We could call the set \`[1,2,3]\` **AwesomeNumber**
* We could call the set \`[4,5,6,7,8,9]\` **CoolNumber**
* We could call the set \`[10,11,12,13,14,15,16,17,18,19]\` **SuperNumber**

TypeScript has some built-in types that are commonly used:

* **number** - numbers
* **string** - strings
* **boolean** - boolean values
* **object** - objects
* **undefined** - undefined values
* **null** - null values
* **any** - any type (use sparingly)
* **void** - no return value (for functions)
* **Array<T>** - arrays of type T
* **Set<T>** - sets of type T`,
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
