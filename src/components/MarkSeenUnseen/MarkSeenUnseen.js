import axios from "axios";
import Cookies from "js-cookie";
import styles from "./MarkSeenUnseen.module.scss";

export default function MarkSeenUnseen(props) {
  const { seen, setSeen, movie, isFav } = props;
  const errorMessage = "There was an error, try again later.";
  const mark = (unseen) => async () => {
    try {
      await axios.patch(
        `https://arcane-lowlands-53007.herokuapp.com/api/favs/${movie.id}`,
        { seen: "change!" },
        {
          withCredentials: true,
          headers: {
            "x-api-token": Cookies.get("JWT_TOKEN"),
          },
        }
      );
      if (unseen) {
        setSeen(false);
      } else {
        setSeen(true);
      }
    } catch (error) {
      console.log(error);
      alert(errorMessage);
    }
  };

  if (!isFav) return null;

  return seen ? (
    <h2 className={styles.mark} onClick={mark(true)}>
      MARK AS UNSEEN
    </h2>
  ) : (
    <h2 className={styles.mark} onClick={mark(false)}>
      MARK AS SEEN
    </h2>
  );
}
