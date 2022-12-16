import { useState } from 'react';
import './App.css';
import { Button, Card, CardContent, Typography } from '@mui/material';

import { babyNames } from './utils/babyNames';
import { partition } from './utils/utils';

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
  const dataset = babyNames;

  const [currentName, setCurrentName] = useState('Select a gender');

  const datasets = partition(dataset, (elem: string[]) => elem[1] === 'MALE');

  let popularityMeterMale: { [key: number]: string } = {};
  let popularityMeterFemale: { [key: number]: string } = {};

  popularityMeterMale = fillPopularityMeter(datasets[0]);
  popularityMeterFemale = fillPopularityMeter(datasets[1]);

  const popularityMeters = [popularityMeterMale, popularityMeterFemale];

  function handleOnClick(gender: number) {
    const name = pickRandomName(popularityMeters[gender]);
    setCurrentName(name);
  }

  return (
    <div className="App">
      <div className="Title">Baby name generator</div>
      <div className="Container">
        <div className="Buttons">
          <Button
            color="primary"
            size="large"
            variant="outlined"
            onClick={() => handleOnClick(GENDERS.MALE)}
          >
            Male
          </Button>
          <Button
            color="primary"
            size="large"
            variant="outlined"
            onClick={() => handleOnClick(GENDERS.FEMALE)}
          >
            Female
          </Button>
        </div>
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
