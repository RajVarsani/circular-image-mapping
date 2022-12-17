import React from "react";
import styles from "./UserCard.module.css";
function UserCard({
  size,
  image,
  id,
}: {
  size: number;
  image: string;
  id: string;
}) {
  return (
    <div
      className={styles.container}
      style={{ "--size": size } as React.CSSProperties}
    >
      <img src={image} alt="user" className={styles.img} id={id} />
    </div>
  );
}

export default UserCard;
