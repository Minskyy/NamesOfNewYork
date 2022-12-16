import { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

import { partition } from "./utils/utils";

const GENDERS = {
  MALE: 0,
  FEMALE: 1,
};

function fillPopularityMeter(dataset: string[][]) {
  let counter = 0;

  let popularityMeter: { [key: number]: string } = {};

  for (const entry of dataset) {
    const [YoB, babyGender, ethnicity, name, equalNameCount, rank] = entry;
    counter += parseInt(equalNameCount);
    popularityMeter[counter] = name;
  }

  return popularityMeter;
}

function pickRandomName(popularityMeter: { [key: number]: string }) {
  const keys = Object.keys(popularityMeter);
  const totalCount = keys[keys.length - 1];

  const randNumber = Math.floor(Math.random() * parseInt(totalCount));

  let keyToReturn: number = 0;
  for (let key of keys) {
    if (parseInt(key) > randNumber) {
      keyToReturn = parseInt(key);
      break;
    }
  }

  const name = popularityMeter[keyToReturn];

  return name;
}

function App() {
  const [selectedGender, setSelectedGender] = useState(GENDERS.MALE);

  const [popularityMeters, setPopularityMeters] = useState<
    { [key: number]: string }[]
  >([]);

  const [namesByEthnicity, setNamesByEthnicity] = useState<{
    [key: string]: string[][];
  }>({});

  const [selectedEthnicity, setSelectedEthnicity] =
    useState<string>("HISPANIC");

  const [ethnicities, setEthnicities] = useState<string[]>([]);

  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    fetch("https://data.cityofnewyork.us/api/views/25th-nujf/rows.json")
      .then((res) => res.json())
      .then((response) => {
        const dataset = response.data;

        const mappedData = dataset.map((elem: string[]) => elem.slice(8));

        const namesByEthnicity: { [key: string]: string[][] } = {};

        for (const entry of mappedData) {
          if (namesByEthnicity[entry[2]]) {
            namesByEthnicity[entry[2]].push(entry);
          } else {
            namesByEthnicity[entry[2]] = [entry];
          }
        }

        setNamesByEthnicity(namesByEthnicity);

        setEthnicities(Object.keys(namesByEthnicity));
      });
  }, []);

  function handleOnSelectGender(gender: number) {
    setSelectedGender(gender);
  }

  function handleOnGenerateName() {
    const name = pickRandomName(popularityMeters[selectedGender]);
    setCurrentName(name);
  }

  function fillPopMeters(ethnicity: string) {


    const datasets = partition(
      namesByEthnicity[ethnicity],
      (elem: string[]) => elem[1] === "MALE"
    );

    let popularityMeterMale: { [key: number]: string } = {};
    let popularityMeterFemale: { [key: number]: string } = {};

    popularityMeterMale = fillPopularityMeter(datasets[0]);
    popularityMeterFemale = fillPopularityMeter(datasets[1]);

    setPopularityMeters([popularityMeterMale, popularityMeterFemale]);
  }

  function handleDropdownChange(event: SelectChangeEvent<string>) {
    setSelectedEthnicity(event.target.value);
    fillPopMeters(event.target.value)
  }

  return (
    <div className="App">
      <div className="Title">Baby name generator</div>
      <div className="Container">
        <div className="Buttons">
          <Button
            color={selectedGender === GENDERS.MALE ? "success" : "primary"}
            size="large"
            variant="outlined"
            onClick={() => handleOnSelectGender(GENDERS.MALE)}
          >
            Male
          </Button>
          <Button
            size="large"
            color={selectedGender === GENDERS.FEMALE ? "success" : "primary"}
            variant="outlined"
            onClick={() => handleOnSelectGender(GENDERS.FEMALE)}
          >
            Female
          </Button>
        </div>
        <div className="Break"></div>
        <Select value={selectedEthnicity} onChange={handleDropdownChange}>
          {ethnicities.map((ethnicity) => (
            <MenuItem key={ethnicity} value={ethnicity}>
              {ethnicity}
            </MenuItem>
          ))}
        </Select>
        <div className="Break"></div>

        <Button
          color="primary"
          size="large"
          variant="outlined"
          onClick={() => handleOnGenerateName()}
        >
          Generate
        </Button>
        <div className="Break"></div>

        <Card>
          <CardContent>
            <Typography variant="h4">
              {/* names are coming both in upper and lower case. 
            So we format to title case by setting to lower case here, and then capitalizing with css */}
              {currentName.toLowerCase()}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
