import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import Mapping from "../components/Mapping";

enum RelationType {
  PUBLICATION = "publication",
  CLINIC_TRIALS = "clinic_trials",
  SPEAKING_SESSION = "speaking_session",
  POSTER_SESSION = "poster_session",
  JEB = "jeb",
  ORGANIZATION = "organization",
}

interface Person {
  level: number;
  image: string;
  id: string;
}

interface PeopleData {
  mainPerson?: Person;
  firstLevelPeople?: Person[];
  secondLevelPeople?: Person[];
}

interface Relation {
  parent: string;
  child: string;
  types: RelationType[];
}

const RELATION_TYPES = Object.values(RelationType);

const generateRandomRelationTypes = () => {
  const numberOfRelationTypes =
    Math.floor(Math.random() * RELATION_TYPES.length) + 1;
  var shuffled = [...RELATION_TYPES].sort(() => {
    return 0.5 - Math.random();
  });
  shuffled.sort();
  return shuffled.slice(0, numberOfRelationTypes);
};
function App() {
  const [people, setPeople] = useState<PeopleData>({});
  const loading = useRef(false);
  const [relations, setRelations] = useState<Relation[]>([]);

  useEffect(() => {
    fetchRandomImages();
  }, []);

  const fetchRandomImages = async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const response = await axios.get("https://randomuser.me/api/?results=16");
      const data = response.data.results;
      const tmpPeople: any = {};
      tmpPeople.mainPerson = {
        level: 0,
        image: data[0].picture.large,
        id: data[0].login.uuid,
      };
      data.shift();
      tmpPeople.firstLevelPeople = data.slice(0, 5).map((person: any) => {
        return {
          level: 1,
          image: person.picture.large,
          id: person.login.uuid,
        };
      });
      data.splice(0, 5);
      tmpPeople.secondLevelPeople = data.map((person: any) => {
        return {
          level: 2,
          image: person.picture.large,
          id: person.login.uuid,
        };
      });

      let TMPrelations: Relation[] = [];
      const firstLevelRelations = tmpPeople.firstLevelPeople.map(
        (person: any): Relation => {
          return {
            parent: tmpPeople.mainPerson.id,
            child: person.id,
            types: generateRandomRelationTypes(),
          };
        }
      );
      TMPrelations = TMPrelations.concat(firstLevelRelations);
      const secondLevelRelations = tmpPeople.secondLevelPeople.map(
        (person: any, index: number): Relation => {
          return {
            parent:
              tmpPeople.firstLevelPeople[Math.floor(index / 2).toString()].id,
            child: person.id,
            types: generateRandomRelationTypes(),
          };
        }
      );
      TMPrelations = TMPrelations.concat(secondLevelRelations);

      setPeople(tmpPeople);
      setRelations(TMPrelations);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Mapping people={people} relations={relations} />
    </div>
  );
}

export default App;
