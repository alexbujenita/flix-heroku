import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import { useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { cookieParser } from "../../utils/cookieParser/cookieParser";
import styles from "./userFavs.module.scss";

export default function UserFavs(props) {
  const [inProgress, setInProgress] = useState(false);
  const [active, setActive] = useState("none");

  function setFilter(action) {
    if (action === active) {
      setActive("none");
    } else {
      setActive(action);
    }
  }

  function filterWatched(movie) {
    if (active === "none") return true;
    return active === "seen" ? movie.seen : !movie.seen;
  }

  async function downloadFavsAsPdf() {
    setInProgress(true);
    const { data } = await axios.get(
      "https://arcane-lowlands-53007.herokuapp.com/api/favs/pdf",
      {
        headers: {
          "x-api-token": Cookies.get("JWT_TOKEN"),
        },
        responseType: "blob",
      }
    );
    const url = URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "favs.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setInProgress(false);
  }
  return (
    <>
      <Head>
        <title>Users favs</title>
        <meta
          name="description"
          content="Showing the user's favourites results."
        />
      </Head>
      <div className={styles.downloadContainer}>
        {inProgress ? (
          <>
            <h3>Please wait while for the file to download.</h3>
            <h3>Usually a minute for 50 movies.</h3>
          </>
        ) : (
          <h1 onClick={downloadFavsAsPdf} className={styles.downloadText}>
            Download your favourites as PDF
          </h1>
        )}
      </div>
      <div className={styles.watchedFilter}>
        <span
          className={active === "seen" ? styles.active : ""}
          onClick={() => {
            setFilter("seen");
          }}
        >
          SEEN
        </span>
        <span>|</span>
        <span
          className={active === "unseen" ? styles.active : ""}
          onClick={() => {
            setFilter("unseen");
          }}
        >
          UNSEEN
        </span>
      </div>
      <div className={styles.moviesContainer}>
        {props.UserFavourites.filter(filterWatched).map((m) => (
          <MovieCard
            key={m.id}
            poster_path={m.moviePosterPath}
            title={m.movieTitle}
            id={m.movieRefId}
          />
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const { JWT_TOKEN } = cookieParser(ctx.req.headers.cookie);
    const { data } = await axios.get(
      "https://arcane-lowlands-53007.herokuapp.com/api/favs/user-favs",
      {
        headers: { "x-api-token": JWT_TOKEN },
      }
    );
    return {
      props: data,
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}
