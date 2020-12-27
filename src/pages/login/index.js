import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
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
        data: { firstName },
      } = await axios.post(
        "http://localhost:3001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("LOGGED", firstName);
      const {
        data: { UserFavourites },
      } = await axios.get("http://localhost:3001/api/favs/user-favs", {
        withCredentials: true,
      });
      if (UserFavourites.length) {
        const movieIds = UserFavourites.map((fav) => fav.movieRefId);
        localStorage.setItem("UserFavs", JSON.stringify(movieIds));
      } else {
        localStorage.setItem("UserFavs", JSON.stringify([]));
      }
      router.push("/movies");
    } catch (e){
      console.log(e)
      localStorage.removeItem("LOGGED");
      alert("SOMETHIGN WRONG");
    }
  };
  return (
    <>
      <Head>
        <title>LOGIN</title>
        <meta name="description" content="A login page" />
      </Head>
      <form onSubmit={formSubmit}>
        <div className="container">
          <label>
            <b>Email</b>
          </label>
          <input
            value={email}
            type="text"
            onChange={handleChange}
            placeholder="Enter Email"
            name="email"
            required
          />

          <label>
            <b>Password</b>
          </label>
          <input
            type="text"
            placeholder="Enter Password"
            value={password}
            onChange={handleChange}
            name="psw"
            required
          />

          <button type="submit">Login</button>
        </div>
      </form>
    </>
  );
}