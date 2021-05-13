import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./Login.module.scss";
import Cookies from "js-cookie";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleChange = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    try {
      const {
        data: { firstName, jwt },
      } = await axios.post(
        "https://arcane-lowlands-53007.herokuapp.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("LOGGED", firstName);
      localStorage.setItem("JWT_TOKEN", jwt);
      Cookies.set("JWT_TOKEN", jwt);
      const {
        data: { UserFavourites },
      } = await axios.get(
        "https://arcane-lowlands-53007.herokuapp.com/api/favs/user-favs",
        {
          withCredentials: true,
          headers: {
            "x-api-token": localStorage.getItem("JWT_TOKEN"),
          },
        }
      );
      if (UserFavourites.length) {
        const movieIds = UserFavourites.map((fav) => fav.movieRefId);
        localStorage.setItem("UserFavs", JSON.stringify(movieIds));
      } else {
        localStorage.setItem("UserFavs", JSON.stringify([]));
      }
      router.push(localStorage.getItem("previousMovie") ?? "/movies");
    } catch (e) {
      console.log(e);
      localStorage.removeItem("LOGGED");
      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("UserFavs");
      alert("SOMETHING WRONG");
    } finally {
      localStorage.removeItem("previousMovie");
    }
  };
  return (
    <>
      <Head>
        <title>LOGIN</title>
        <meta name="description" content="A login page" />
      </Head>
      <form onSubmit={formSubmit}>
        <section className={styles.loginContainer}>
          <div className={styles.loginDetails}>
            <label>
              <b>Email</b>
            </label>
            <input
              value={email}
              type="email"
              onChange={handleChange}
              placeholder="Enter Email"
              name="email"
              required
            />
          </div>
          <div className={styles.loginDetails}>
            <label>
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={handleChange}
              name="psw"
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </section>
      </form>
    </>
  );
}
