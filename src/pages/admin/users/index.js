import axios from "axios";
import Link from "next/link";
import { cookieParser } from "../../../utils/cookieParser/cookieParser";
import styles from "../admin.module.scss";

export default function Admin({ count, rows }) {
  return (
    <div>
      <h1>Found {count} users.</h1>
      <ul className={styles.userList}>
        {rows.map(({ id, firstName, lastName = "Missing Last-Name" }) => (
          <Link href={`/admin/users/${id}`} key={id}>
            <li className={styles.user}>
              ID: {id}. {firstName} {lastName}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const { JWT_TOKEN } = cookieParser(ctx.req.headers.cookie);
    const { data } = await axios.get(
      "https://arcane-lowlands-53007.herokuapp.com/admin/users",
      {
        headers: { "x-api-token": JWT_TOKEN },
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
