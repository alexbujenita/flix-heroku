import axios from "axios";
import Cookies from "js-cookie";
import { cookieParser } from "../../../utils/cookieParser/cookieParser";
// import styles from "../admin.module.scss"; TODO!!!
export default function AdminUserInfo({ count, rows: [UserFavourites] }) {
  const favs = UserFavourites.UserFavourites;

  function deleteFav(movieId) {
    return async function () {
      if (!window.confirm("Delete a fav?")) return;
      try {
        await axios.delete(
          `https://arcane-lowlands-53007.herokuapp.com/admin/users/${UserFavourites.id}/movie/${movieId}`,
          {
            withCredentials: true,
            headers: { "x-api-token": Cookies.get("JWT_TOKEN") },
          }
        );
        window.location.reload(true);
      } catch (e) {
        console.log(e);
      }
    };
  }

  const movieRefIdSet = new Set();

  favs.forEach((fav) => {
    if (movieRefIdSet.has(fav.movieRefId)) {
      fav.isDuplicate = true;
    }
    movieRefIdSet.add(fav.movieRefId);
  });

  movieRefIdSet.clear();

  return (
    <div>
      <h2>
        User ID: {UserFavourites.id}. {UserFavourites.firstName}{" "}
        {UserFavourites.lastName} has {count} favs.
      </h2>
      <table>
        <thead>
          <tr
            key={id}
            style={{ backgroundColor: isDuplicate ? "red" : "white" }}
          >
            <td>DB ID</td>
            <td>TMDB ID</td>
            <td>TITLE</td>
          </tr>
        </thead>
        <tbody>
          {favs.map(({ id, movieRefId, movieTitle }) => {
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{movieRefId}</td>
                <td>{movieTitle}</td>
                <td onClick={deleteFav(id)}>DELETE</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const { JWT_TOKEN } = cookieParser(ctx.req.headers.cookie);
    const {
      params: { id },
    } = ctx;
    const { data } = await axios.get(
      `https://arcane-lowlands-53007.herokuapp.com/admin/users/${parseInt(
        id
      )}/movies`,
      {
        headers: { "x-api-token": JWT_TOKEN },
      }
    );
    return {
      props: data,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
