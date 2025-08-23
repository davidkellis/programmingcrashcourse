import type { TutorialSection } from '@/types'

export const RUBY_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: `Welcome!

This is a programing tutorial that aims to teach you how to read and write code in the most widely used programming languages: C, C++, C#, Java, Scala, Kotlin, Groovy, JavaScript, TypeScript, Go, Nim, Rust, etc.

Most of the widely used languages look and behave very similarly. They are all [imperative languages](https://en.wikipedia.org/wiki/Imperative_programming). They are so similar that if you know one, you almost know them all.

Throughout the tutorial you'll see short inline code snippets illustrated like \`nr: this\`. Some inline snippets have a green Run button with a little arrow like ➤, for example: \`1+2\`. Click the Run button with the arrow ➤ to evaluate it in the REPL (read–evaluate–print loop) docked to the side or bottom of the page.

You'll also see editable code blocks like this:

\`\`\`ruby
def say_hello(name)
  puts "Hello #{name}"
end

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

* **TrueClass** / **FalseClass**
* **Integer**
* **Float**
* **String**
* **Array**
* **Hash**
* **Set** (requires 'set')
* **NilClass**`,
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
