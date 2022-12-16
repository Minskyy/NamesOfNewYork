import { useState } from 'react';
import './App.css';
import {
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

import { babyNames } from './utils/babyNames';
import { partition } from './utils/utils';

const GENDERS = {
  MALE: 0,
  FEMALE: 1,
};

function App() {
  const dataset = babyNames;

  const [currentName, setCurrentName] = useState('Select a gender');

  const datasets = partition(dataset, (elem: string[]) => elem[1] === 'MALE');

  function pickRandomName(gender: number) {
    // Typescript gives us an error on trying to access with .length, so this workaround was made
    const index = Math.floor(Math.random() * datasets[gender]['length']);

    const [YoB, babyGender, ethnicity, name, equalNameCount, rank] =
      datasets[gender][index];

    setCurrentName(name);

    return datasets[gender][index];
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
            onClick={() => pickRandomName(GENDERS.MALE)}
          >
            Male
          </Button>
          <Button
            color="primary"
            size="large"
            variant="outlined"
            onClick={() => pickRandomName(GENDERS.FEMALE)}
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
