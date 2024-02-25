import "../styles/main.css";

/**
 * An interface for shared state tracking for all the pushed commands
 */
interface REPLHistoryProps {
  history: string[];
}
/**
 * Displays all commands inputted
 * @param props
 * @returns All commands inputted
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="repl-history">
      {/* This is where command history will go */}
      {props.history.map((command, index) => (
        <p>{command}</p>
      ))}
    </div>
  );
}
