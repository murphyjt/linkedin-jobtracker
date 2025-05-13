import {useRef, useState, type ChangeEvent, useEffect} from "react";
import classes from "./search.module.css";

interface SearchProps {
  values: Set<string>;
}

export default function Search({values}: SearchProps) {
  const [term, setTerm] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTerm(event.target.value);
  }

  useEffect(() => {
    ref.current?.focus();
  }, [values]);

  return (
    <>
      <input id="search" type="search" placeholder="Search" className="full-width"
             value={term} ref={ref} onChange={handleChange}/>
      {term && Array.from(values).filter(v => v.toLowerCase().includes(term.toLowerCase())) && (
        <output>
          <ul id="search-result" className={classes.list}>
            {Array.from(values).filter(v => v.toLowerCase().includes(term.toLowerCase())).sort().map(item => {
              const index = item.toLowerCase().indexOf(term.toLowerCase());
              const prefix = item.slice(0, index);
              const match = item.slice(index, index + term.length);
              const suffix = item.slice(index + term.length);

              return (
                <li key={item}>
                  {prefix}
                  <strong>{match}</strong>
                  {suffix}
                </li>
              );
            })}
          </ul>
        </output>
      )}
    </>
  )
}
