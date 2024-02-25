import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { REPLFunction } from "./REPLFunction";
import { exampleCSV1, income_by_race } from "./mockedData";

/** an interface that contains all the input props */
interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
}

/** a function that handles inputs to the REPL
 * @return REPLFunction */
export function REPLInput(props: REPLInputProps) {
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>("brief"); // true = brief, false = verbose
  var functionMap: Map<String, () => REPLFunction> = new Map();
  var csvMap: Map<String, (string[] | number[])[]> = new Map();
  var resultString: string = "";
  var csvString: string[] = [];
  var stringList: string[] = commandString.split(" ");

  const [load_file, setLoadFile] = useState<string>();

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

  /** a function that allows the user to view a loaded csv file
   * @return REPLFunction - the currently loaded CSV*/
  function view(): REPLFunction {
    return (args: string[]): String | String[][] => {
      if (load_file) {
        const csv = csvMap.get(load_file);
        if (csv) {
          let rowString: string[] = [];
          csv.forEach((row, index) => {
            rowString.push(`Row ${index + 1}: ${row.join(", ")}`);
          });
          csvString = rowString;
          resultString = "Currently viewing loaded CSV";
        }
      } else {
        resultString = "No file loaded";
      }
      return resultString;
    };
  }
  /** a function that searchers the loaded CSV for a value in a specified column
   *  @returns REPLFunction - the rows in which the value was found in. */
  function search(): REPLFunction {
    return (args: string[]): String | String[][] => {
      if (load_file) {
        const csv = csvMap.get(load_file);
        if (csv) {
          var rowsWithValue: string[] = [];
          if (args.length < 2) {
            csv.forEach((row, index) => {
              if (row[Number(args[0])] == args[1]) {
                rowsWithValue.push(row.join(", "));
              }
            });
            csvString = rowsWithValue;
            resultString =
              "Values found in the following row(s): " +
              rowsWithValue.toString();
          } else {
            resultString = "Proper arguments not found";
          }
        } else {
          resultString = "File not found";
        }
      } else {
        resultString = "No file loaded";
      }
      return resultString;
    };
  }

  /** a function that sets the loaded file to the first command argument
   * @return REPLFunction */
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

  /** a function that changes output mode
   * @return REPLFunction */
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

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
    </div>
  );
}
