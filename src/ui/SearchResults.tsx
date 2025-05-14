import classes from "./search-results.module.css";

export function SearchResults({values, term = ""}: { values: Set<string>; term?: string }) {
  return Array.from(values).filter(v => v.toLowerCase().includes(term.toLowerCase())) && (
    <output>
      <ul id="search-results" className={classes.list}>
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
  )
}
