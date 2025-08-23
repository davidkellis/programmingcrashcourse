import type { TutorialSection } from '@/types'

export const RUBY_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome to Ruby programming! This tutorial will teach you the fundamentals of Ruby through interactive examples.

Ruby is a dynamic, open source programming language with a focus on simplicity and productivity. It has an elegant syntax that is natural to read and easy to write. Let's start exploring the basic building blocks of Ruby programming.

Let's begin with your first Ruby program:

\`\`\`ruby
puts "Hello, World!"
puts "Welcome to Ruby programming!"
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
* comments are ignored by the Ruby interpreter

\`\`\`ruby
# this line is a comment
# everything to the right of a # symbol is a comment and is ignored by the Ruby interpreter
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
   * \`true\`
   * \`false\`
* an array of values, for example:
   * \`[1, 3, 5, 7, 9]\`
   * \`[3.141592653589793, "pi", "pie"]\`
   * \`[1000, "cookies", true]\`
   * \`[0, "cookies", false]\`
* a hash is a collection of associated key/value pairs, for example:
   * \`{1 => "one", 2 => "two", 3 => "three"}\`
   * \`{"Jack" => "Cookies", "Jill" => "Ice Cream", "Phil" => "Asparagus"}\`
* an instance of a class (more on this later)

Let's see how these values evaluate in the Ruby REPL (IRB):

\`\`\`ruby
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
{1 => "one", 2 => "two", 3 => "three"}
{"Jack" => "Cookies", "Jill" => "Ice Cream", "Phil" => "Asparagus"}
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

Sets in Ruby are created using the Set class (you need to require 'set' first):

* \`Set[1,2,3]\`
* \`Set["Jack", "Jill"]\`
* \`Set[1, 3.141592653589793, "Steve", true]\``,
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

Ruby has some built-in types (classes) that are commonly used:

* **Integer** - whole numbers
* **Float** - floating point numbers (numbers with a decimal point)
* **String** - strings
* **TrueClass** / **FalseClass** - boolean values
* **Array** - arrays
* **Hash** - hashes (key-value pairs)
* **Set** - sets (requires 'set' library)
* **NilClass** - nil (Ruby's null value)`,
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

\`my_age = 25\`

In this example, \`my_age\` is the variable name, and \`25\` is the value.

Here is what this looks like in the Ruby REPL (IRB):

\`\`\`
my_age = 25
my_age
\`\`\`

In this code snippet, we are running the Ruby interpreter in its interactive mode (called IRB for Interactive Ruby), and assigning the value \`25\` to the variable named \`my_age\`, and then we read the value stored in the \`my_age\` variable by entering the name of the variable by itself and pressing enter; IRB shows us that the value \`25\` is currently stored in the variable named \`my_age\`.`,
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

A function in Ruby is called a method. Here is a method for printing a message:

\`\`\`ruby
def print_hello
  puts "Hello"
end
\`\`\`

This method has a name (\`print_hello\`) and a list of instructions to follow (print "Hello").

Methods can also accept parameters (inputs). Here is a method that accepts one parameter:

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
    codeSnippets: [],
    previousSection: 'expressions',
    nextSection: 'function-invocation'
  },
  {
    id: 'function-invocation',
    title: 'Function Invocation',
    order: 9,
    content: `You can use a method by calling it, or invoking it. Calling a method is the same thing as invoking it.

A method may be called, or invoked, by typing the name of the method, optionally followed by parenthesis. If the method was defined to accept parameters, then you must supply values for those parameters.

For example, to call the \`print_hello\` method:

\`print_hello\` or \`print_hello()\`

To call the \`print_my_age\` method, we must supply a value for the \`age\` parameter:

\`print_my_age(8)\` or \`print_my_age 8\`

Here is what this looks like in IRB:

\`\`\`
irb(main):001:0> def print_hello
irb(main):002:1>   puts "Hello"
irb(main):003:1> end
=> :print_hello
irb(main):004:0> print_hello
Hello
=> nil
irb(main):005:0> def print_my_age(age)
irb(main):006:1>   puts "I am #{age} years old"
irb(main):007:1> end
=> :print_my_age
irb(main):008:0> print_my_age(8)
I am 8 years old
=> nil
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
    codeSnippets: [],
    previousSection: 'functions',
    nextSection: 'conditionals'
  },
  {
    id: 'conditionals',
    title: 'Conditional Expressions',
    order: 10,
    content: `The primary conditional or branching expression is the \`if\` / \`elsif\` / \`else\` expression.

There are three variations:

* \`if\`
   * \`if i_am_hungry then puts "I'm starving!" end\`
* \`if\` / \`else\`
   * \`if i_am_hungry then puts "I'm starving!" else puts "I am full." end\`
* \`if\` / \`elsif\` / \`else\`
   * \`if age < 5 then puts "You are younger than five years old." elsif age < 10 then puts "You are five to nine years old." else puts "You are ten or older" end\`

In each case, the \`if\` expression is always followed by an expression that evaluates to a boolean value.`,
    codeSnippets: [],
    previousSection: 'function-invocation'
  }
]
