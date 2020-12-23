import Image from "next/image";
import styles from './PersonCard.module.scss';

export default function PersonCard(props) {
  console.log(props);
  return (
    <div className={styles.personContainer}>
      <div className={styles.personImageContainer}>
        <Image
          src={
            props.profile_path
              ? `https://image.tmdb.org/t/p/w342${props.profile_path}`
              : "/image-placeholder-vertical.jpg"
          }
          alt={props.original_name}
          width={parseInt(342 / 3)}
          height={parseInt(513 / 3)}
        />
      </div>
      <div className={styles.personNames}>
        <p><b>{props.original_name}</b></p>
        {props.character ? (
          <>
            <p>as</p> <p><i>{props.character}</i></p>
          </>
        ) : null}
      </div>
    </div>
  );
}