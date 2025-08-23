import type { TutorialSection } from '@/types'

export const PYTHON_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome to Python programming! This tutorial will teach you the fundamentals of Python through interactive examples.

Python is a powerful, easy-to-learn programming language that emphasizes code readability and simplicity. Let's start exploring the basic building blocks of Python programming.

Let's begin with your first Python program:

\`\`\`python
print("Hello, World!")
print("Welcome to Python programming!")
\`\`\``,
    codeSnippets: [],
    nextSection: 'comments'
  },
  {
    id: 'comments',
    title: 'Comments',
    order: 2,
    content: `* lines that start with # are comments
* comments are just explanations about something
* comments are ignored by the Python interpreter

\`\`\`python
# this line is a comment
# everything to the right of a # symbol is a comment and is ignored by the Python interpreter
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
   * \`1_000_000 # numbers may not have commas in them, but may use underscores instead\`
* a quoted string, for example:
   * \`"my name is David"\`
   * \`"I ate a sleeve of cookies"\`
   * \`"I had to exercise"\`
* a boolean true or false value, for example:
   * \`True\`
   * \`False\`
* a list of values, for example:
   * \`[1, 3, 5, 7, 9]\`
   * \`[3.141592653589793, "pi", "pie"]\`
   * \`[1000, "cookies", True]\`
   * \`[0, "cookies", False]\`
* a dictionary is a collection of associated key/value pairs, for example:
   * \`{1: "one", 2: "two", 3: "three"}\`
   * \`{"Jack": "Cookies", "Jill": "Ice Cream", "Phil": "Asparagus"}\`
* an instance of a class (more on this later)

Let's see how these values evaluate in the Python REPL:

\`\`\`python
1
1.4
3.141592653589793
1000
1000000
1_000_000
"my name is David"
"I ate a sleeve of cookies"
"I had to exercise"
True
False
[1, 3, 5, 7, 9]
[3.141592653589793, "pi", "pie"]
[1000, "cookies", True]
[0, "cookies", False]
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
* \`True\`

This is **not** a set (because some values are repeated):

* \`1\`
* \`1\`
* \`3.141592653589793\`

Sets in Python are notated with curly braces:

* \`{1,2,3}\`
* \`{"Jack", "Jill"}\`
* \`{1, 3.141592653589793, "Steve", True}\``,
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
   * The type **TinyNumber** is the set of values \`[1,2,3]\`
* We could give the name **DogName** to the set \`["Max", "Ace", "Tiny"]\`
   * The type **DogName** is the set of values \`["Max", "Ace", "Tiny"]\`
* We could name the set \`[99, 100, 101]\` **AgeOfAnOldPerson**
   * The type **AgeOfAnOldPerson** is the set of values \`[99, 100, 101]\`
* We could say **SmallOddNumber** is the set \`[1, 3, 5, 7, 9]\`
   * The type **SmallOddNumber** is the set \`[1, 3, 5, 7, 9]\`

If a value is in the set belonging to a type name, then we say the value is of that type, or we say that the value has that type.

* Since \`1\` is in the **TinyNumber** set:
   * we say, 1 is of type TinyNumber
   * we say, 1 has the type TinyNumber
* Since \`1\` is in the **SmallOddNumber** set
   * we say, 1 is of type SmallOddNumber
   * we say, 1 has the type SmallOddNumber
* Since \`99\` is in the **AgeOfAnOldPerson** set
   * we say, 99 is of type AgeOfAnOldPerson
   * we say, 99 has the type AgeOfAnOldPerson
* Since \`"Max"\` is in the **DogName** set
   * we say, \`"Max"\` is of type DogName
   * we say \`"Max"\` has the type DogName

In Python, there is a type called \`int\` that is the set of all numbers **without** a decimal point:

* ...
* \`-3\`
* \`-2\`
* \`-1\`
* \`0\`
* \`1\`
* \`2\`
* \`3\`
* ...

There is a type called \`float\` that is the set of all numbers **with** a decimal point:

* ... (numbers less than -3.0)
* \`-3.0\`
* ... (numbers between -3.0 and -1.0)
* \`-1.0\`
* ... (numbers between -1.0 and 0.0)
* \`0.0\`
* ... (numbers between 0.0 and 1.0)
* \`1.0\`
* ... (numbers between 1.0 and 1.1)
* \`1.1\`
* ... (numbers between 1.1 and 1.2)
* \`1.2\`
* ... (numbers between 1.2 and 1000.0)
* \`1000.0\`
* ... (numbers greater than 1000.0)

Python has a bunch of built in types:

* **bool** - boolean
* **int** - integers (numbers without a decimal point)
* **float** - floating point numbers (numbers with a decimal point)
* **str** - strings
* **set** - sets
* **dict** - dictionary (also called a map)`,
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

1. You can think of a variable as a name that we use to point at a value
   * For example:
      * what_i_ate_for_breakfast → \`"cereal"\`
      * my_current_age → \`10.5\`
2. You can also think of a variable as a box with name on it and it holds a value inside
   * For example:

We name a variable with letters, numbers, and the underscore character, for example:

* \`firstName\`
* \`last_name\`
* \`myAge\`
* \`what_i_ate_for_breakfast\`
* \`name1\`
* \`name2\`

We can't use spaces in variable names.

We use the equal sign, \`=\` , to make a variable point at a value, or put a value into the box, like this:

my_age_last_year = 25

This makes the \`my_age_last_year\` variable point to the value \`25\`.

This puts the value \`25\` into the box named \`my_age_last_year\`, like this:

The equal sign, \`=\` , is called the assignment operator.

When we use the assignment operator, \`=\` , to make a variable point at a value, we call that an assignment expression.

In an assignment expression, we use the \`=\` operator to assign the value on the right hand side of the \`=\` operator to the variable on the left hand side of the \`=\` operator.

These are all assignment expressions:

* \`my_age = 25\`
* \`my_first_word = "cookie"\`
* \`number_of_cookies_i_want_to_eat = 100\`

When we use the name of a variable by itself, without the assignment operator, we are reading the value that the variable points at, or we are opening the box and reading the value inside.

To show an example, we can run the following code in the Python interpreter:

❯ python
Python 3.12.5 (main, Aug 14 2024, 05:08:31) [Clang 18.1.8 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> my_age = 25
>>> my_age
25

In this code snippet, we are running the Python interpreter in its interactive mode (called the read-evaluate-print-loop, or REPL for short), and assigning the value \`25\` to the variable named \`my_age\`, and then we read the value stored in the \`my_age\` variable by entering the name of the variable by itself and pressing enter; the REPL shows us that the value \`25\` is currently stored in the variable named \`my_age\`.`,
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
   * \`123\` - integer literal expressions
   * \`3.14159\` - floating point literal expressions
   * \`True\` - boolean literal expressions
   * \`"Max"\` - string literal expressions
   * \`[1, 2, 3, 1, 2, 3]\` - list literal expressions
   * \`{1: "one", 2: "two"}\` - dictionary literal expressions
* variable expressions
   * \`my_age\` - variable expressions
   * \`what_i_ate_for_breakfast\` - variable expressions
* assignment expressions
   * \`my_age = 25\` - assignment expressions
   * \`what_i_ate_for_breakfast = "cereal"\` - assignment expressions
* operator expressions
   * \`1 + 2\` - operator expressions
   * \`3 * 4\` - operator expressions
   * \`10 / 2\` - operator expressions
   * \`5 - 3\` - operator expressions

An expression is anything that can be evaluated to produce a value.

When we evaluate an expression, we compute the value that the expression represents.

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

There are 2 simple rules that you must follow when naming a function:

1. The name can't have any spaces or hyphens (dashes) in it. Just replace spaces and hyphens with underscores.
   * Peanut Butter Sandwich → Peanut_Butter_Sandwich
   * Peanut-Butter-Sandwich → Peanut_Butter_Sandwich
2. The name can't begin with a number. It must begin with a letter or an underscore.
   * These are bad names; they won't work, because they start with a number:
      * 1dog
      * 2_apples
   * These are good names; these will work, because they do not start with a number:
      * one_dog
      * two_apples
      * _20_people
      * book_x5

In Python, we create a function by using the special keyword \`nr: def\`, followed by the name of the function, followed by parenthesis at the end of the function name, followed by a colon (a colon is this character: \`nr: :\` ), like this:

def make_peanut_butter_sandwich():
  pass

A function also has a body, which is just the list of instructions we want the function to evaluate. The function body is an expression sequence. For example:

def make_peanut_butter_sandwich():
  toast_the_bread()
  spread_peanut_butter_onto_the_toast()
  smash_the_pieces_of_toast_with_peanut_butter_together()
  clean_up()
  put_the_sandwich_on_a_plate()

In addition to a name and a body, a function may have parameters. A function parameter is like a variable that gets set every time the function is called or invoked. A function parameter is just a variable that the function expects to be supplied when the function is called. Parameters are defined inside the parenthesis that follow the name of the function, and they are separated with a comma.

The following example function has two parameters: \`kind_of_bread\` , and \`quantity\`

def make_peanut_butter_sandwich(kind_of_bread, quantity):
  for i in range(quantity):
    toast_the_bread(kind_of_bread)
    spread_peanut_butter_onto_the_toast()
    smash_the_pieces_of_toast_with_peanut_butter_together()
    clean_up()
    put_the_sandwich_on_a_plate()

This function has one parameter: \`age\`

def print_my_age(age):
  print("I am", age, "years old")

This function has no parameters:

def print_hello():
  print("Hello")`,
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

For example, if we have the following function without any parameters:

def print_hello():
  print("Hello")

we can call it, or invoke it, by typing its name, followed by an empty set of parenthesis, like this:

print_hello()

When we call this function in an interactive interpreter session, here is what happens:

❯ python
Python 3.13.2 (main, Feb 12 2025, 14:51:17) [Clang 19.1.6 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def print_hello():
...   print("Hello")
...
>>> print_hello()
Hello

If we have the following function with one parameter:

def print_my_age(age):
  print("I am", age, "years old")

we can call it by typing its name, followed by an open paren, followed by an age, followed by a close paren, like this:

print_my_age(8)

When we call this function in an interactive interpreter session, here is what happens:

❯ python
Python 3.13.2 (main, Feb 12 2025, 14:51:17) [Clang 19.1.6 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def print_my_age(age):
...   print("I am", age, "years old")
...
>>> print_my_age(8)
I am 8 years old

If we have the following function with two parameters:

def print_introduction(name, age):
  print("Hello, my name is", name, "and I am", age, "years old")

we can call it by typing its name, followed by an open paren, followed by a name, followed by an age, followed by a close paren, like this:

print_introduction("Jim", 9)

When we call this function in an interactive interpreter session, here is what happens:

❯ python
Python 3.13.2 (main, Feb 12 2025, 14:51:17) [Clang 19.1.6 ] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def print_introduction(name, age):
...   print("Hello, my name is", name, "and I am", age, "years old")
...
>>> print_introduction("Jim", 9)
Hello, my name is Jim and I am 9 years old

In addition to accepting input parameters, functions can also return a value to the caller of the function.

For example, if we have a function like:

def add_five(value):
  return value + 5

and we call it like this:

three_plus_five = add_five(3)

then the value returned by the function call \`add_five(3)\` is assigned to the variable named \`three_plus_five\` , which means that after the assignment expression has been evaluated, the variable \`three_plus_five\` contains the value \`8\`.

We can see that in the following interactive interpreter session:

>>> def add_five(value):
...   return value + 5
...
>>> three_plus_five = add_five(3)
>>> three_plus_five
8`,
    codeSnippets: [],
    previousSection: 'functions',
    nextSection: 'conditionals'
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 10,
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
    codeSnippets: [],
    previousSection: 'function-invocation'
  }
]
