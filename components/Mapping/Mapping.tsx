import React, { useEffect } from "react";
import styles from "./Mapping.module.css";
import UserCard from "./../UserCard";
import useMediaQuery from "../helpers/useMediaQuery";

const LINE_COLORS: { [key: string]: string } = {
  publication: "#F2B864",
  clinic_trials: "#1B87D9",
  speaking_session: "#FC99B0",
  poster_session: "#00A7A7",
  jeb: "#B2D4F5",
  organization: "#91DBDD",
};

function Mapping(props: any) {
  const screenSize = useMediaQuery();
  const { people, relations } = props;
  console.log(
    people.mainPerson,
    people.firstLevelPeople,
    people.secondLevelPeople,
    relations
  );

  const [relationsLines, setRelationsLines] = React.useState<JSX.Element[]>([]);

  useEffect(() => {
    setRelationsLines([] as JSX.Element[]);
    const relationsLinesTMP: JSX.Element[] = [];
    relations.forEach((relation: any) => {
      const parent = document.getElementById(relation.parent);
      const child = document.getElementById(relation.child);
      if (parent && child) {
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        const parentCenterX = parentRect.x + parentRect.width / 2;
        const parentCenterY = parentRect.y + parentRect.height / 2;
        const childCenterX = childRect.x + childRect.width / 2;
        const childCenterY = childRect.y + childRect.height / 2;
        const angle = Math.atan2(
          childCenterY - parentCenterY,
          childCenterX - parentCenterX
        );
        const length = Math.sqrt(
          Math.pow(childCenterX - parentCenterX, 2) +
            Math.pow(childCenterY - parentCenterY, 2)
        );
        const line = (
          <div
            className={styles.line}
            style={
              {
                "--angle": angle,
                "--length": length,
                "--parentCenterX": parentCenterX,
                "--parentCenterY": parentCenterY,
              } as React.CSSProperties
            }
          >
            {relation.types.map((type: string, index: number) => (
              <div
                key={index}
                className={styles.relationType}
                style={
                  { backgroundColor: LINE_COLORS[type] } as React.CSSProperties
                }
              />
            ))}
          </div>
        );
        relationsLinesTMP.push(line);
      }
    });
    console.log(relationsLinesTMP);
    setRelationsLines(relationsLinesTMP);
  }, [relations, people, screenSize]);
  return (
    <div className={styles.container}>
      <div className={styles.wrapperCircle}>
        <div className={styles.secondLevelCircle}>
          {relationsLines
            ? relationsLines.map((line: any, index: number) => (
                <div key={index}>{line}</div>
              ))
            : null}

          {people.secondLevelPeople &&
            people.secondLevelPeople.map((person: any, index: number) => (
              <div
                className={styles.secondLevelCircleImages}
                key={index}
                style={
                  {
                    "--angle":
                      (360 / people.secondLevelPeople.length) * (index - 0.5),
                  } as React.CSSProperties
                }
              >
                <UserCard size={0.9} image={person.image} id={person.id} />
              </div>
            ))}
          <div className={styles.firstLevelCircle}>
            {people.firstLevelPeople &&
              people.firstLevelPeople.map((person: any, index: number) => (
                <div
                  className={styles.firstLevelCircleImages}
                  key={index}
                  style={
                    {
                      "--angle": (360 / people.firstLevelPeople.length) * index,
                    } as React.CSSProperties
                  }
                >
                  <UserCard size={1.4} image={person.image} id={person.id} />
                </div>
              ))}

            {people.mainPerson && (
              <UserCard
                size={3}
                image={people.mainPerson.image}
                id={people.mainPerson.id}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.colorCodingListWrapper}>
        <h4 className={styles.colorCodingListTitle}>Color Coding</h4>
        <div className={styles.colorCodingList}>
          {Object.keys(LINE_COLORS).map((key: string, index: number) => (
            <div key={index} className={styles.colorCodingListItem}>
              <div
                className={styles.colorCodingListItemColor}
                style={
                  { backgroundColor: LINE_COLORS[key] } as React.CSSProperties
                }
              />
              <div className={styles.colorCodingListItemName}>
                {key.replace("_", " ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mapping;
