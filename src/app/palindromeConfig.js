// palindromeConfig.js
const palindromeConfig = {
  initialState: "q0",
  acceptingStates: ["acceptOdd"],
  rejectingStates: ["reject"],
  blank: "_",
  states: ["q0", "q1", "q2", "q3", "q4", "q5", "acceptOdd", "reject"],
  transitions: {
    q0: {
      0: ["q1", "X", "R"],
      1: ["q2", "X", "R"],
      X: ["acceptOdd", "X", "R"], // Accept if only one unmatched symbol remains (odd-length palindrome)
    },
    q1: {
      0: ["q1", "0", "R"],
      1: ["q1", "1", "R"],
      _: ["q3", "_", "L"],
      X: ["q3", "X", "L"],
    },
    q2: {
      0: ["q2", "0", "R"],
      1: ["q2", "1", "R"],
      _: ["q4", "_", "L"],
      X: ["q4", "X", "L"],
    },
    q3: {
      X: ["acceptOdd", "X", "R"], // Accept if X is encountered as the only remaining unmatched symbol
      0: ["q5", "X", "L"],
      1: ["reject", "1", "L"], // Reject if unmatched 1 is encountered
    },
    q4: {
      X: ["acceptOdd", "X", "R"], // Accept if X is encountered as the only remaining unmatched symbol
      1: ["q5", "X", "L"],
      0: ["reject", "0", "L"], // Reject if unmatched 0 is encountered
    },
    q5: {
      0: ["q5", "0", "L"],
      1: ["q5", "1", "L"],
      X: ["q0", "X", "R"], // Go back to the start after marking
    },
  },
};

export default palindromeConfig;
