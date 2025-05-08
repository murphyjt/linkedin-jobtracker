import {useRef, useState, type ChangeEvent, useEffect} from "react";
import classes from "./search.module.css";

interface SearchProps {
  values: Set<string>;
}

export default function Search({values}: SearchProps) {
  const [results, setResults] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const term = event.target.value.toLowerCase();
    if (!term) {
      setResults([]);
    } else {
      setResults(Array.from(values).filter(v => v.toLowerCase().includes(term)).sort());
    }
  }

  useEffect(() => {
    ref.current?.focus();
  }, [values]);

  return (
    <>
      <input id="search" type="search" placeholder="Search" className="full-width"
             ref={ref} onChange={handleChange}/>
      {results.length > 0 && (
        <output>
          <ul id="search-result" className={classes.list}>{results.map(result => (
            <li className={classes.result}>{result}</li>
          ))}</ul>
        </output>
      )}
    </>
  )
}
