import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import isLogged from "../../utils/isLogged";
import AddRemoveFav from "../../components/AddRemoveFav/AddRemoveFav";
import MarkSeenUnseen from "../../components/MarkSeenUnseen/MarkSeenUnseen";
import PersonCard from "../../components/PersonCard/PersonCard";
import Trailers from "../../components/Trailers/Trailers";
import Rating from "../../components/Rating/Rating";
import Cookies from "js-cookie";
import styles from "./Movie.module.scss";

export default function Movie(props) {
  const { movie } = props;
  const {
    credits,
    videos: trailers,
    release_date = "",
    imdb_id,
    genres = [],
  } = movie;
  const [isFav, setIsFav] = useState(false);
  const [movieRating, setMovieRating] = useState(0);
  const [seen, setSeen] = useState(false);
  const [displayCast, setDisplayCast] = useState(false);
  const { poster_path, title, original_title, tagline, overview } = movie;

  useEffect(() => {
    const getPossibleFav = async () => {
      const { data } = await axios.get(
        `https://arcane-lowlands-53007.herokuapp.com/api/favs/user-favs/${parseInt(
          movie.id
        )}`,
        {
          withCredentials: true,
          headers: {
            "x-api-token": Cookies.get("JWT_TOKEN"),
          },
        }
      );
      if (data) {
        setIsFav(true);
        setSeen(data.seen);
        setMovieRating(data.rating);
      }
    };
    isLogged() && getPossibleFav();
  }, [movie.id]);

  return (
    <>
      <Head>
        <title>{movie.title || movie.original_title}</title>
        <meta
          name="description"
          content={`Overall information for the movie ${
            movie.title || movie.original_title
          }`}
        />
      </Head>
      <div className={styles.movieIntroContainer}>
        {poster_path ? (
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w185${poster_path}`}
            alt={title}
            width={185}
            height={278}
          />
        ) : null}
        <div className={styles.movieIntro}>
          <h1>
            {title || original_title}
            {release_date ? ` (${release_date.substring(0, 4)})` : null}
          </h1>
          {tagline ? (
            <h2>
              <i>{tagline}</i>
            </h2>
          ) : null}
          <h4>
            Genres: {genres.map((genre) => genre.name).join(", ") || "N/A"}
          </h4>
          {overview ? <h3>{overview}</h3> : null}
        </div>
      </div>
      {imdb_id ? (
        <div className={styles.links}>
          <a
            href={`https://www.imdb.com/title/${imdb_id}`}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className={styles.link}
          >
            IMDb
          </a>
        </div>
      ) : null}
      <Rating
        isFav={isFav}
        movieRating={movieRating}
        movie={movie}
        setMovieRating={setMovieRating}
      />
      <AddRemoveFav isFav={isFav} setIsFav={setIsFav} movie={movie} />
      <MarkSeenUnseen
        isFav={isFav}
        seen={seen}
        setSeen={setSeen}
        movie={movie}
      />
      <Link href={`/movie/similar-movies/${movie.id}`}>
        <a>
          <h2 className={styles.showHideCast}>SIMILAR MOVIES</h2>
        </a>
      </Link>
      <Link href={`/movie/recommendations/${movie.id}`}>
        <a>
          <h2 className={styles.showHideCast}>RECOMMENDED MOVIES</h2>
        </a>
      </Link>
      {trailers?.results?.length ? (
        <Trailers trailers={trailers.results} />
      ) : null}
      {credits?.cast?.length && !displayCast ? (
        <h2
          className={styles.showHideCast}
          onClick={() => setDisplayCast(true)}
        >
          SHOW CAST
        </h2>
      ) : null}
      {displayCast && (
        <h2
          className={styles.showHideCast}
          onClick={() => setDisplayCast(false)}
        >
          HIDE CAST
        </h2>
      )}
      {displayCast ? (
        <div className={styles.movieCastContainer}>
          {credits.cast.map((person) => (
            <PersonCard key={person.id} {...person} />
          ))}
        </div>
      ) : null}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const {
    params: { movieId },
  } = ctx;
  try {
    const { data } = await axios.get(
      `https://arcane-lowlands-53007.herokuapp.com/api/movie/${parseInt(
        movieId
      )}/include-all`
    );
    return {
      props: {
        movie: data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
