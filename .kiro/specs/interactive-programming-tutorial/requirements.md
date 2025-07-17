# Requirements Document

## Introduction

This feature creates an interactive programming tutorial web application that teaches programming concepts to learners aged 10 and older. The tutorial preserves the carefully crafted language, analogies, and sequential structure from the existing book material while adding multi-language support and interactive code execution capabilities. The application allows users to select from common programming languages and provides an integrated REPL for immediate code evaluation and experimentation. The system is designed to accommodate the ongoing development of the book content, including planned sections on loops and other programming concepts.

## Requirements

### Requirement 1

**User Story:** As a learner, I want to select my preferred programming language so that I can learn programming concepts in the language I'm most interested in.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a language selection interface
2. WHEN a user selects a programming language THEN the system SHALL update all code snippets and examples to reflect the selected language
3. IF a user changes their language selection THEN the system SHALL persist this choice and update all content accordingly
4. WHEN displaying language options THEN the system SHALL support at least Python, JavaScript, Java, C++, and Go

### Requirement 2

**User Story:** As a learner, I want to see programming concepts explained using the same clear language and analogies from the book so that I can understand complex topics through familiar explanations.

#### Acceptance Criteria

1. WHEN displaying tutorial content THEN the system SHALL preserve the exact language, analogies, and explanations from the source book material
2. WHEN presenting concepts like variables THEN the system SHALL include both the "pointing at values" and "box with name" analogies
3. WHEN explaining types THEN the system SHALL use the set-based explanations and examples from the book
4. WHEN teaching functions THEN the system SHALL include the recipe analogies and step-by-step explanations

### Requirement 3

**User Story:** As a learner, I want to interact with code snippets by sending expressions to a REPL so that I can immediately see how code executes and experiment with variations.

#### Acceptance Criteria

1. WHEN hovering over any code expression THEN the system SHALL display a "Send to REPL" button or similar interactive element
2. WHEN clicking the "Send to REPL" button THEN the system SHALL execute the expression in the integrated REPL
3. WHEN an expression is executed THEN the system SHALL display the result in the REPL output area
4. WHEN the REPL encounters an error THEN the system SHALL display clear error messages to help learning

### Requirement 4

**User Story:** As a learner, I want access to a persistent REPL environment so that I can experiment with code, build upon previous expressions, and maintain context throughout my learning session.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a REPL interface occupying the bottom quarter of the screen
2. WHEN I type expressions in the REPL THEN the system SHALL evaluate them in the context of the selected programming language
3. WHEN I execute multiple expressions THEN the system SHALL maintain variable state and context between executions
4. WHEN I define functions or variables THEN the system SHALL make them available for subsequent expressions

### Requirement 5

**User Story:** As a learner, I want to navigate through tutorial content in a structured way so that I can progress through programming concepts in the intended sequence.

#### Acceptance Criteria

1. WHEN accessing the tutorial THEN the system SHALL present content in the same sequence as the book material
2. WHEN viewing a section THEN the system SHALL provide navigation to previous and next sections
3. WHEN displaying content THEN the system SHALL maintain the hierarchical structure of concepts from the book
4. WHEN a user navigates between sections THEN the system SHALL preserve their REPL state and selected language

### Requirement 6

**User Story:** As a learner, I want the tutorial interface to be intuitive and focused on learning so that I can concentrate on understanding programming concepts without being distracted by complex UI elements.

#### Acceptance Criteria

1. WHEN using the application THEN the system SHALL provide a clean, distraction-free interface focused on content
2. WHEN displaying code snippets THEN the system SHALL use syntax highlighting appropriate for the selected language
3. WHEN showing the REPL THEN the system SHALL clearly distinguish between input and output areas
4. WHEN presenting tutorial sections THEN the system SHALL use readable typography and appropriate spacing for learners aged 10 and older

### Requirement 7

**User Story:** As a content author, I want the system to accommodate ongoing book development so that I can add new sections like loops without requiring system redesign.

#### Acceptance Criteria

1. WHEN new content is added to the book material THEN the system SHALL automatically incorporate it into the tutorial
2. WHEN book sections are modified THEN the system SHALL reflect those changes in the tutorial content
3. WHEN new programming concepts are introduced THEN the system SHALL display appropriate code examples for the selected language
4. WHEN the book structure changes THEN the system SHALL maintain proper navigation and sequencing
