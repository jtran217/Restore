# 2026_CursorHackathon

"Make a product that will make people work smarter when their brain is feeling overwhelmed"

## Project Scope

Our project is a desktop-first productivity and wellness assistant designed to help people work smarter when their brain feels overwhelmed. Instead of acting like another task manager or AI to-do list, the app focuses on detecting moments of cognitive overload in real time and guiding the user through a short recovery flow that helps them reset, refocus, and continue working.

The prototype uses biometric-inspired and behavioral signals, such as heart rate, sedentary time, and optional desktop activity patterns, to estimate when a user may be becoming overwhelmed. Because of hackathon time constraints, we are scoping the MVP around a simulated heart rate input using a lightweight Python script rather than full Apple Watch integration. This allows us to demonstrate the core product experience: detecting overload, notifying the user at the right moment, and providing immediate support through short interventions like breathing exercises, movement prompts, and next-step clarification.

Our goal is to build a functional MVP that proves the central idea: when people are mentally overloaded, they do not need more planning tools — they need timely, low-friction support that helps them recover and get back into focused work.

## Features

P0:
A) Signal Input Layer: Fakes heart rate with a python app + manual im overwhelmed button + shows the heart rate + current heart rate + Focus Strain score based on app swithing, idle time, + long session time
B) Detect the heart rate and the decesion when certain is criteria is met
C) intervention pop up, encourage a walk breathe clairfy etc
E) Refocus mode: Ask user what they are working and what they need done on and suggest a way re-engage focus

P1:
A) Desktop activity + browerser activity +idle vs active + session duration
B) When session completed show stats of the work session
C) Demo: Normal, Stress, Overload

## Screens

Home

- Current HR
- Overwhelmed Status (lets not call it that)
- session + start stop

Focus Mode (session state screen)

- minimal + timer
- manual intervention avaialbe

Intervention Screen (Session state screen)

- Help decompress
- provide suggestion to break + encourage a reflection
- provide guidance to begin tasks when ready
- re-initialize next timer.

Session Summary Screen (Session State complete screen)

- Breakdown of session

Journal

- Enteries of journals + logs
- record of heart rate
- history of cognitive overload

## Python HR Server

- Create a Python server that directly sends a payload to the electron app
  - Will be sending through json ds

## Judging Criteria

**Innovation**
How original and creative is the solution? Judges will consider the novelty of the idea and how thoughtfully it approaches the challenge.

**Impact**
How meaningful is the problem being addressed, and how much potential does the solution have to help people?

**Usability**
How intuitive and accessible is the product? Judges will look at how easy it is for someone to understand and use the solution.

**Technical Execution**
How well was the solution built? Judges will consider the quality of the implementation and how effectively technology is used.

**Implementation**
How functional and well-developed is the prototype? Judges will consider how clearly the submission demonstrates the core idea.

**Presentation**
How clearly and effectively the team pitches their product. Judges will consider the clarity of the explanation, quality of the demo, and how well the team conveys the problem, solution, and value of their product.
