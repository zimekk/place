import React, { Suspense, lazy, useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
// import history from "history/browser";
import styles from "./App.module.scss";

const Spinner = () => <span>Loading...</span>;

const PAGES = {
  home: lazy(() => import("./Home")),
};

// const getPage = (location: { hash: string }) => {
//   const [path, hash = Object.keys(PAGES)[0]] =
//     decodeURI(location.hash).match(/^#(.+)/) || [];
//   return hash;
// };

function App() {
  // const [page, setPage] = useState(getPage(history.location));

  // useEffect(() =>
  //   // location is an object like window.location
  //   history.listen(({ location, action, ...rest }) =>
  //     setPage(getPage(location))
  //   )
  // );

  const page = Object.keys(PAGES)[0] as keyof typeof PAGES;
  const Demo = PAGES[page] || null;

  return (
    <section className={styles.App}>
      <h1 className={styles.Nav}>
        Place
        {Object.keys(PAGES).map((page) => (
          <a key={page} href={`#${page}`}>
            {page}
          </a>
        ))}
      </h1>
      <Suspense fallback={<Spinner />}>
        <Demo />
      </Suspense>
    </section>
  );
}

export default hot(App);
