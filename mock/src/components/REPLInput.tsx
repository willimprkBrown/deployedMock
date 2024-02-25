import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { REPLFunction } from "./REPLFunction";
import { exampleCSV1, income_by_race } from "./mockedData";

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
  var functionMap: Map<String, () => REPLFunction> = new Map();
  var csvMap: Map<String, (string[] | number[])[]> = new Map();
  var resultString: string = "";
  var csvString: string[] = [];
  var stringList: string[] = commandString.split(" ");

  const [load_file, setLoadFile] = useState<string>("exampleCSV1");

  csvMap.set("exampleCSV1", exampleCSV1);
  csvMap.set("income_by_race", income_by_race);

  functionMap.set("boo", boo);
  functionMap.set("mode", changeMode);
  functionMap.set("view", view);
  functionMap.set("search", search);
  functionMap.set("load_file", loadFile);

  function boo(): REPLFunction {
    return (args: string[]): String | String[][] => {
      return "boo";
    };
  }

  function view(): REPLFunction {
    return (args: string[]): String | String[][] => {
      const csv = csvMap.get(load_file);
      if (csv) {
        let rowString: string[] = [];
        csv.forEach((row, index) => {
          rowString.push(`Row ${index + 1}: ${row.join(", ")}`);
        });
        csvString = rowString;
        resultString = "Currently viewing loaded CSV";
      } else {
        resultString = "No file loaded";
      }
      return resultString;
    };
  }

  function search(): REPLFunction {
    return (args: string[]): String | String[][] => {
      const csv = csvMap.get(load_file);
      if (csv) {
        var rowsWithValue: string[] = []; //search col value
        csv.forEach((row, index) => {
          if (row[Number(args[0])] == args[1]) {
            rowsWithValue.push(row.join(", "));
          }
        });
        csvString = rowsWithValue;
        resultString =
          "Values found in the following row(s): " + rowsWithValue.toString();
      } else {
        resultString = "File not found";
      }
      return resultString;
    };
  }

  function loadFile(): REPLFunction {
    return (args: string[]): String | String[][] => {
      if (args.length >= 1) {
        setLoadFile(args[0]);
        resultString = "result: loaded file: " + stringList[1];
      } else {
        resultString = "result: No file given";
      }
      return resultString;
    };
  }

  function changeMode(): REPLFunction {
    return (args: string[]): String | String[][] => {
      let modeString = mode;
      if (commandString == "mode") {
        if (mode == "brief") {
          modeString = "verbose";
        } else {
          modeString = "brief";
        }
        setMode(modeString);
        resultString = "result: mode changed to " + modeString;
      }
      return resultString;
    };
  }

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    setCount(count + 1);
    const func = functionMap.get(stringList[0]);

    if (func) {
      resultString = func()(stringList.slice(1)).toString();
    }

    if (mode == "brief") {
      if (resultString == "") {
        props.setHistory([
          ...props.history,
          "invalid command: " + commandString,
        ]);
      } else {
        if (commandString == "view" || commandString == "search") {
          props.setHistory([...props.history, resultString, ...csvString]);
        } else {
          props.setHistory([...props.history, resultString]);
        }
      }
    } else {
      if (resultString == "") {
        props.setHistory([
          ...props.history,
          commandString,
          "invalid command: " + commandString,
        ]);
      } else {
        if (commandString == "view" || commandString == "search") {
          props.setHistory([
            ...props.history,
            commandString,
            resultString,
            ...csvString,
          ]);
        } else {
          props.setHistory([...props.history, commandString, resultString]);
        }
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
