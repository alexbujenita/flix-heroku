import Link from "next/link";
import styles from "./PersonCard.module.scss";

function PersonCard({
  id,
  fromSearch,
  profile_path,
  original_name,
  name,
  character,
}) {
  const width = fromSearch ? 342 : parseInt(342 / 3);
  const height = fromSearch ? 513 : parseInt(523 / 3);

  return (
    <div
      className={
        fromSearch ? styles.personContainerSearch : styles.personContainer
      }
    >
      <Link href={`/actor/${id}`} passHref>
        <div className={styles.personImageContainer}>
          <a className={styles.imgLink}>
            <img
              loading="lazy"
              src={
                profile_path
                  ? `https://image.tmdb.org/t/p/w342${profile_path}`
                  : "/image-placeholder-vertical.jpg"
              }
              alt={original_name}
              width={width}
              height={height}
            />
          </a>
        </div>
      </Link>
      <div className={styles.personNames}>
        <p>
          <b>{original_name || name}</b>
        </p>
        {character ? (
          <>
            <p>as</p>{" "}
            <p>
              <i>{character}</i>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default PersonCard;
