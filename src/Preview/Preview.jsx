import React from "react";

import styles from "./Preview.module.css";

export function Preview({ title, style }) {
  return (
    <div className={styles.preview} style={style}>
      <div>{title}</div>
      <div>25:00</div>
    </div>
  );
}
