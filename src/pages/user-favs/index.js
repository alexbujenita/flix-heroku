import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import { useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./userFavs.module.scss";

export default function UserFavs(props) {
  const [inProgress, setInProgress] = useState(false);

  async function downloadFavsAsPdf() {
    setInProgress(true);
    const { data } = await axios.get(
      "https://arcane-lowlands-53007.herokuapp.com/api/favs/pdf",
      {
        withCredentials: true,
        headers: {
          "x-api-token": localStorage.getItem("JWT_TOKEN"),
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
      <div className={styles.moviesContainer}>
        {props.UserFavourites.map((m) => (
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
    const token = ctx.req.headers.cookie.match(/JWT_TOKEN=(.*?);/s)[1];
    const { data } = await axios.get(
      "https://arcane-lowlands-53007.herokuapp.com/api/favs/user-favs",
      {
        headers: { "x-api-token": token },
        withCredentials: true,
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
