import Link from "next/link";
import { useEffect, useState } from "react";
import LogInOut from "../LogInOut/LogInOut";
import isLogged from "../../utils/isLogged";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./NavBar.module.scss";

export default function NavBar() {
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    const isLoggedIn = isLogged();
    if (logged !== isLoggedIn) {
      setLogged(isLoggedIn);
    }
  });
  return (
    <div className={styles.navBarContainer}>
      <Link href="/movies">
        <a>
          <h3>Movies</h3>
        </a>
      </Link>
      <Link href="/random-movies">
        <a>
          <h3>RaNDom</h3>
        </a>
      </Link>
      {logged && (
        <Link href="/user-favs">
          <a>
            <h3>FAVS</h3>
          </a>
        </Link>
      )}
      <SearchBar />
      <LogInOut name={logged} />
    </div>
  );
}
