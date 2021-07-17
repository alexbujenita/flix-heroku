import Image from "next/image";
import Link from "next/link";
import AddRemoveIcon from "../AddRemoveIcon/AddRemoveIcon";
import styles from "./MovieCard.module.scss";

export default function MovieCard(props) {
  const { title, poster_path, id, release_date } = props;

  return (
    <div className={styles.movieCard}>
      <AddRemoveIcon movie={props} />
      <Link href={`/movie/${id}`}>
        <a>
          <div className={styles.movieCardImage}>
            <img
              loading="lazy"
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w342${poster_path}`
                  : "/image-placeholder-vertical.jpg"
              }
              alt={title}
              width={342}
              height={513}
            />
          </div>
        </a>
      </Link>
      <p className={styles.movieTitle}>{title}</p>
      {release_date && (
        <span className={styles.releaseYear}>
          {" "}
          ({release_date.substring(0, 4)})
        </span>
      )}
    </div>
  );
}
