// route.js
import { NextResponse } from "next/server";
import palindromeConfig from "@/app/palindromeConfig";

export async function POST(request) {
  try {
    const { input } = await request.json();
    const result = runTuringMachine(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function runTuringMachine(input) {
  const tape = input.split("");
  let currentState = palindromeConfig.initialState;
  let headPosition = 0;
  const steps = [];

  try {
    while (
      !palindromeConfig.acceptingStates.includes(currentState) &&
      !palindromeConfig.rejectingStates.includes(currentState)
    ) {
      const currentSymbol = tape[headPosition] || palindromeConfig.blank;
      const transition =
        palindromeConfig.transitions[currentState][currentSymbol];

      if (!transition) {
        throw new Error(
          `No transition defined for state ${currentState} and symbol ${currentSymbol}`
        );
      }

      const [nextState, writeSymbol, moveDirection] = transition;

      // Record the current step
      steps.push({
        tape: tape.join(""),
        headPosition,
        currentState,
        nextState,
        writeSymbol,
        moveDirection,
      });

      tape[headPosition] = writeSymbol;
      currentState = nextState;
      headPosition +=
        moveDirection === "R" ? 1 : moveDirection === "L" ? -1 : 0;
    }

    const isPalindrome =
      palindromeConfig.acceptingStates.includes(currentState);
    const palindromeType = isPalindrome ? "even" : "not a palindrome";

    return { isPalindrome, palindromeType, steps };
  } catch (error) {
    console.error("Error running Turing Machine:", error);
    throw error;
  }
}
