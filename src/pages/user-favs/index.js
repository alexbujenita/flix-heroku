import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav";
import MovieCard from "../../components/MovieCard/MovieCard";
import { cookieParser } from "../../utils/cookieParser/cookieParser";
import styles from "./userFavs.module.scss";

export default function UserFavs(props) {
  const [inProgress, setInProgress] = useState(false);
  const { page, totalPages, rows } = props;
  const { query } = useRouter();

  if (!rows.length) {
    return <h1>Nothing here...</h1>;
  }

  const nextPage = page >= totalPages ? page : page + 1;
  const prevPage = page <= 1 ? 1 : page - 1;

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
        <Link
          passHref
          href={`/user-favs?page=1${query.seen === "true" ? "" : `&seen=true`}`}
        >
          <a className={query.seen === "true" ? styles.active : ""}>SEEN</a>
        </Link>
        <Link
          passHref
          href={`/user-favs?page=1${
            query.seen === "false" ? "" : `&seen=false`
          }`}
        >
          <a className={query.seen === "false" ? styles.active : ""}>
            NOT SEEN
          </a>
        </Link>
      </div>
      <div className={styles.moviesContainer}>
        {rows[0].UserFavourites.map((m) => (
          <MovieCard
            key={m.movieRefId}
            poster_path={m.moviePosterPath}
            title={m.movieTitle}
            id={m.movieRefId}
          />
        ))}
      </div>
      <BottomNav
        prev={`/user-favs?page=${prevPage}${
          query.seen ? `&seen=${query.seen}` : ""
        }`}
        next={`/user-favs?page=${nextPage}${
          query.seen ? `&seen=${query.seen}` : ""
        }`}
      />
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const { JWT_TOKEN } = cookieParser(ctx.req.headers.cookie);
    const {
      query: { page = 1, seen = "" },
    } = ctx;
    const { data } = await axios.get(
      `https://arcane-lowlands-53007.herokuapp.com/api/favs/user-favs?page=${page}&seen=${seen}`,
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
