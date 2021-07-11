import axios from "axios";
import Cookies from "js-cookie";
import { FaStar } from "react-icons/fa";
import styles from "./Rating.module.scss";

export default function Rating({ isFav, movieRating, movie, setMovieRating }) {
  if (!isFav) return null;
  const STARS = [];
  const rate = async (rating) => {
    if (movieRating === rating) return;
    try {
      const a=await axios.patch(
        `https://arcane-lowlands-53007.herokuapp.com/api/favs/${movie.id}`,
        { rating },
        {
          withCredentials: true,
          headers: {
            "x-api-token": Cookies.get("JWT_TOKEN"),
          },
        }
      );
      setMovieRating(rating);
    } catch (error) {
      console.log(error);
    }
  };
  for (let i = 0; i < 10; i++) {
    STARS.push(
      <FaStar
        key={i}
        color={i < movieRating ? "red" : "grey"}
        cursor={"pointer"}
        size={20}
        onClick={() => {
          rate(i + 1);
        }}
      />
    );
  }
  return <div className={styles.ratingContainer}>{STARS}</div>;
}
