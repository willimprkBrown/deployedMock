import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  // CHANGED
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
}
// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  // TODO WITH TA : add a count state
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>("brief"); // true = brief, false = verbose

  const [load_file, setLoadFile] = useState<string>("");

  const exampleCSV1 = [
    [1, 2, 3, 4, 5],
    ["The", "song", "remains", "the", "same."],
  ];

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    let resultString = "";
    let modeString = mode;
    setCount(count + 1);
    if (commandString == "mode") {
      if (mode == "brief") {
        modeString = "verbose";
      } else {
        modeString = "brief";
      }
      setMode(modeString);
      resultString = "result: mode changed to " + modeString;
    }

    var stringList: string[] = commandString.split(" ");
    if (stringList[0] == "load_file") {
      if (stringList.length > 1) {
        setLoadFile(stringList[1]);
        resultString = "result: loaded file: " + stringList[1];
      } else {
        setLoadFile("");
        resultString = "result: No file given";
      }
    }

    // CHANGED
    if (commandString === "view") {
      let rowString = "";
      exampleCSV1.forEach((row, index) => {
        rowString = `Row ${index + 1}: ${row.join(", ")}`;
        props.setHistory([...props.history, rowString]);
      });
      resultString = "Currently viewing loaded CSV";
    }

    var rowsWithValue: any[][] = []; //search col value
    if (stringList[0] == "search") {
      exampleCSV1.forEach((row, index) => {
        if (row[Number(stringList[1])] == stringList[2]) {
          rowsWithValue.unshift(row);
        }
      });
      resultString =
        "Values found in the following row(s): " + rowsWithValue.toString();
    }
    if (mode == "brief") {
      if (resultString == "") {
        props.setHistory([
          ...props.history,
          "invalid command: " + commandString,
        ]);
      } else {
        props.setHistory([...props.history, resultString]);
      }
    } else {
      if (resultString == "") {
        props.setHistory([
          ...props.history,
          commandString,
          "invalid command: " + commandString,
        ]);
      } else {
        props.setHistory([...props.history, commandString, resultString]);
      }
    }
    setCommandString("");
  }

  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
    </div>
  );
}
