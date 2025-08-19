import type { TutorialSection } from '@/types'

export const JAVASCRIPT_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction to Programming',
    order: 1,
    content: `# Introduction to Programming

Welcome to the world of programming! Programming is like giving instructions to a computer, similar to how you might give directions to a friend.

## What is Programming?

Programming is the process of creating instructions for computers to follow. Think of it like writing a recipe - you need to be very specific about each step.

## Your First Program

Let's start with a simple example. In most programming languages, we can display text on the screen:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

This tells the computer to display the text "Hello, World!" on the screen.

## Variables - Storing Information

Variables are like labeled boxes where we can store information. Think of them as containers with names:

\`\`\`javascript
let name = "Alice";
let age = 25;
\`\`\`

Here we're storing the text "Alice" in a variable called \`name\`, and the number 25 in a variable called \`age\`.
`,
    codeSnippets: [
      {
        id: 'hello-world',
        code: 'console.log("Hello, World!");',
        language: 'javascript',
        isExecutable: true,
        context: 'First program example',
        explanation: 'This displays text on the screen'
      },
      {
        id: 'variables-example',
        code: 'let name = "Alice";\nlet age = 25;\nconsole.log(`My name is ${name} and I am ${age} years old`);',
        language: 'javascript',
        isExecutable: true,
        context: 'Variables example',
        explanation: 'Shows how to store and use variables'
      }
    ],
    nextSection: 'data-types'
  },
  {
    id: 'data-types',
    title: 'Understanding Data Types',
    order: 2,
    content: `# Understanding Data Types

Just like in real life, information comes in different types. In programming, we call these **data types**.

## Numbers

JavaScript has one number type that handles both integers and decimals:

\`\`\`javascript
let age = 15;
let height = 5.8;
\`\`\`

## Text (Strings)

Text in programming is called a "string" - imagine letters strung together like beads on a string:

\`\`\`javascript
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;
console.log(fullName);
\`\`\`

## Boolean Values (True/False)

Sometimes we need to store yes/no or true/false information:

\`\`\`javascript
let isStudent = true;
let isAdult = false;
\`\`\`

## Arrays - Collections of Items

Arrays are like shopping lists - they can hold multiple items:

\`\`\`javascript
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
console.log(fruits[0]); // This prints "apple"
\`\`\`
`,
    codeSnippets: [
      {
        id: 'numbers-example',
        code: 'let age = 15;\nlet height = 5.8;\nconsole.log(`Age: ${age}, Height: ${height}`);',
        language: 'javascript',
        isExecutable: true,
        context: 'Numbers example',
        explanation: 'Shows numbers in JavaScript'
      },
      {
        id: 'strings-example',
        code: 'let firstName = "John";\nlet lastName = "Doe";\nlet fullName = firstName + " " + lastName;\nconsole.log(fullName);',
        language: 'javascript',
        isExecutable: true,
        context: 'String concatenation',
        explanation: 'Shows how to combine strings'
      },
      {
        id: 'boolean-example',
        code: 'let isStudent = true;\nlet isAdult = false;\nconsole.log(`Student: ${isStudent}, Adult: ${isAdult}`);',
        language: 'javascript',
        isExecutable: true,
        context: 'Boolean values',
        explanation: 'Shows true/false values'
      },
      {
        id: 'arrays-example',
        code: 'let fruits = ["apple", "banana", "orange"];\nconsole.log(fruits[0]);\nconsole.log(`I have ${fruits.length} fruits`);',
        language: 'javascript',
        isExecutable: true,
        context: 'Arrays example',
        explanation: 'Shows how to work with arrays'
      }
    ],
    previousSection: 'introduction',
    nextSection: 'functions'
  },
  {
    id: 'functions',
    title: 'Functions - Reusable Code',
    order: 3,
    content: `# Functions - Reusable Code

Functions are like recipes in a cookbook. Once you write a recipe (function), you can use it over and over again!

## What is a Function?

A function is a block of code that performs a specific task. Think of it like a machine:
- You put something in (input)
- The machine does something with it
- You get something out (output)

## Creating Your First Function

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Using the function
let message = greet("Alice");
console.log(message);
\`\`\`

## Functions with Multiple Parameters

Functions can take multiple inputs:

\`\`\`javascript
function addNumbers(a, b) {
    let result = a + b;
    return result;
}

let sum = addNumbers(5, 3);
console.log(\`5 + 3 = \${sum}\`);
\`\`\`

## Functions That Don't Return Values

Some functions just do something without giving back a result:

\`\`\`javascript
function sayHello() {
    console.log("Hello there!");
    console.log("How are you today?");
}

sayHello();
\`\`\`

## Why Use Functions?

1. **Avoid Repetition**: Write once, use many times
2. **Organization**: Keep your code tidy and organized
3. **Testing**: Easier to test small pieces of code
4. **Sharing**: Other people can use your functions
`,
    codeSnippets: [
      {
        id: 'simple-function',
        code: 'function greet(name) {\n    return `Hello, ${name}!`;\n}\n\nlet message = greet("Alice");\nconsole.log(message);',
        language: 'javascript',
        isExecutable: true,
        context: 'Simple function example',
        explanation: 'Shows how to create and use a basic function'
      },
      {
        id: 'function-with-parameters',
        code: 'function addNumbers(a, b) {\n    let result = a + b;\n    return result;\n}\n\nlet sum = addNumbers(5, 3);\nconsole.log(`5 + 3 = ${sum}`);',
        language: 'javascript',
        isExecutable: true,
        context: 'Function with multiple parameters',
        explanation: 'Shows functions that take multiple inputs'
      },
      {
        id: 'function-no-return',
        code: 'function sayHello() {\n    console.log("Hello there!");\n    console.log("How are you today?");\n}\n\nsayHello();',
        language: 'javascript',
        isExecutable: true,
        context: 'Function without return value',
        explanation: 'Shows functions that perform actions without returning values'
      }
    ],
    previousSection: 'data-types'
  }
]
