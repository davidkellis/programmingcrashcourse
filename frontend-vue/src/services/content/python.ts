import type { TutorialSection } from '@/types'

export const PYTHON_TUTORIAL_SECTIONS: TutorialSection[] = [
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

\`\`\`python
print("Hello, World!")
\`\`\`

This tells the computer to display the text "Hello, World!" on the screen.

## Variables - Storing Information

Variables are like labeled boxes where we can store information. Think of them as containers with names:

\`\`\`python
name = "Alice"
age = 25
\`\`\`

Here we're storing the text "Alice" in a variable called \`name\`, and the number 25 in a variable called \`age\`.
`,
    codeSnippets: [
      {
        id: 'hello-world',
        code: 'print("Hello, World!")',
        language: 'python',
        isExecutable: true,
        context: 'First program example',
        explanation: 'This displays text on the screen'
      },
      {
        id: 'variables-example',
        code: 'name = "Alice"\nage = 25\nprint(f"My name is {name} and I am {age} years old")',
        language: 'python',
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

There are two main types of numbers:

### Integers (Whole Numbers)
\`\`\`python
age = 15
score = 100
\`\`\`

### Floating-Point Numbers (Decimals)
\`\`\`python
height = 5.8
temperature = 98.6
\`\`\`

## Text (Strings)

Text in programming is called a "string" - imagine letters strung together like beads on a string:

\`\`\`python
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name
print(full_name)
\`\`\`

## Boolean Values (True/False)

Sometimes we need to store yes/no or true/false information:

\`\`\`python
is_student = True
is_adult = False
\`\`\`

## Lists - Collections of Items

Lists are like shopping lists - they can hold multiple items:

\`\`\`python
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
print(fruits[0])  # This prints "apple"
\`\`\`
`,
    codeSnippets: [
      {
        id: 'numbers-example',
        code: 'age = 15\nheight = 5.8\nprint(f"Age: {age}, Height: {height}")',
        language: 'python',
        isExecutable: true,
        context: 'Numbers example',
        explanation: 'Shows integers and floating-point numbers'
      },
      {
        id: 'strings-example',
        code: 'first_name = "John"\nlast_name = "Doe"\nfull_name = first_name + " " + last_name\nprint(full_name)',
        language: 'python',
        isExecutable: true,
        context: 'String concatenation',
        explanation: 'Shows how to combine strings'
      },
      {
        id: 'boolean-example',
        code: 'is_student = True\nis_adult = False\nprint(f"Student: {is_student}, Adult: {is_adult}")',
        language: 'python',
        isExecutable: true,
        context: 'Boolean values',
        explanation: 'Shows true/false values'
      },
      {
        id: 'lists-example',
        code: 'fruits = ["apple", "banana", "orange"]\nprint(fruits[0])\nprint(f"I have {len(fruits)} fruits")',
        language: 'python',
        isExecutable: true,
        context: 'Lists example',
        explanation: 'Shows how to work with lists'
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

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

# Using the function
message = greet("Alice")
print(message)
\`\`\`

## Functions with Multiple Parameters

Functions can take multiple inputs:

\`\`\`python
def add_numbers(a, b):
    result = a + b
    return result

sum = add_numbers(5, 3)
print(f"5 + 3 = {sum}")
\`\`\`

## Functions That Don't Return Values

Some functions just do something without giving back a result:

\`\`\`python
def say_hello():
    print("Hello there!")
    print("How are you today?")

say_hello()
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
        code: 'def greet(name):\n    return f"Hello, {name}!"\n\nmessage = greet("Alice")\nprint(message)',
        language: 'python',
        isExecutable: true,
        context: 'Simple function example',
        explanation: 'Shows how to create and use a basic function'
      },
      {
        id: 'function-with-parameters',
        code: 'def add_numbers(a, b):\n    result = a + b\n    return result\n\nsum = add_numbers(5, 3)\nprint(f"5 + 3 = {sum}")',
        language: 'python',
        isExecutable: true,
        context: 'Function with multiple parameters',
        explanation: 'Shows functions that take multiple inputs'
      },
      {
        id: 'function-no-return',
        code: 'def say_hello():\n    print("Hello there!")\n    print("How are you today?")\n\nsay_hello()',
        language: 'python',
        isExecutable: true,
        context: 'Function without return value',
        explanation: 'Shows functions that perform actions without returning values'
      }
    ],
    previousSection: 'data-types'
  }
]
