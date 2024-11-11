"use client";
import { useState, useEffect, useRef } from "react";
import Cytoscape from "cytoscape";
import palindromeConfig from "@/app/palindromeConfig";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [allSteps, setAllSteps] = useState([]);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!cyRef.current) {
      cyRef.current = Cytoscape({
        container: document.getElementById("cy"),
        elements: getElementsFromConfig(palindromeConfig),
        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-valign": "center",
              "background-color": "#61bffc",
              "text-outline-color": "#1c1c2b",
              "text-outline-width": 2,
              "color": "#e6e6fa",
              "font-size": "12px",
              "font-weight": "bold",
              "text-shadow": "0 0 4px #7a7aff, 0 0 6px #7a7aff",
              width: "40px",
              height: "40px",
            },
          },
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "line-color": "#6a6aff",
              "target-arrow-color": "#6a6aff",
              width: 2,
            },
          },
        ],
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSteps([]);
    setAllSteps([]);
    const res = await fetch("/api/turingMachine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResult(data.isPalindrome ? "Is a palindrome (odd length)" : "Not a palindrome");
    setAllSteps(data.steps || []);
  };

  useEffect(() => {
    if (allSteps.length > 0) {
      const timer = setInterval(() => {
        setSteps((prevSteps) => [...prevSteps, allSteps[prevSteps.length]]);
      }, 500); // Faster pace

      if (steps.length === allSteps.length) clearInterval(timer);
      return () => clearInterval(timer);
    }
  }, [allSteps, steps.length]);

  const renderTape = (tape, headPosition) => {
    return (
      <>
        <strong style={{ color: "#d586ff", marginRight: "4px" }}>Tape:</strong>
        {tape.split("").map((symbol, index) => (
          <span
            key={index}
            className={index === headPosition ? "head-symbol" : ""}
          >
            {symbol}
          </span>
        ))}
      </>
    );
  };

  return (
    <div id="container">
      <h1>Odd Palindrome Turing Machine</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter binary input"
        />
        <button type="submit">Simulate</button>
      </form>
      {result && <p>{result}</p>}
      <div id="cy" style={{ width: "600px", height: "400px" }}></div>
      {steps.length > 0 && (
        <div>
          <h2>Simulation Steps</h2>
          <table id="steps-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>State Transition</th>
                <th>Tape</th>
                <th>Write Symbol</th>
                <th>Move Direction</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => (
                <tr key={index} className="step-row">
                  <td><strong>Step {index + 1}</strong></td>
                  <td>{step.currentState} {"→"} {step.nextState}</td>
                  <td>{renderTape(step.tape, step.headPosition)}</td>
                  <td>{step.writeSymbol}</td>
                  <td>{step.moveDirection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getElementsFromConfig(config) {
  const elements = [];
  config.states.forEach((state) => {
    elements.push({ data: { id: state, label: state } });
  });

  Object.keys(config.transitions).forEach((state) => {
    Object.keys(config.transitions[state]).forEach((symbol) => {
      const [nextState] = config.transitions[state][symbol];
      elements.push({
        data: { source: state, target: nextState, label: symbol },
      });
    });
  });

  return elements;
}
