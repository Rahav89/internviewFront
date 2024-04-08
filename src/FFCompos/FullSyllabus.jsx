import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function FullSyllabus() {
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };

  // Convert the series data to a format suitable for recharts
  const data = [];
  for (let i = 0; i < itemNb; i++) {
    const item = { name: `Item ${i + 1}` };
    for (let j = 0; j < 2; j++) {
      item[series[j].label] = series[j].data[i]; // Use the label as the key
    }
    data.push(item);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
        width={500}
        height={300}
        data={data}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barCategoryGap="30%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={80} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="בוצע"
          fill="#8884d8"
          stackId="a"
          radius={[0, 10, 10, 0]}
          barSize={20}
          label={{ position: 'inside', fill: 'black' , fontSize: '12px'}}
        />
        <Bar
          dataKey="נדרש"
          fill="#82ca9d"
          stackId="a"
          radius={[0, 10, 10, 0]}
          barSize={20}
          label={{ position: 'inside', fill: 'black' , fontSize: '12px'}}
        />
      </BarChart>
      <FormControlLabel
        checked={skipAnimation}
        control={
          <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
        }
        label="skipAnimation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={38}
        aria-labelledby="input-item-number"
      />
    </Box>
  );
}

// Updated series data with new labels
const series = [
  {
    label: 'בוצע',
    data: [
      2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 1269, 724, 1707, 1188,
      1879, 626, 1635, 2177, 516, 1793, 1598,
    ],
  },
  {
    label: 'נדרש',
    data: [
      2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031, 1757, 862, 2446,
      910, 2430, 2300, 805, 1835, 1684, 2197,
    ],
  },
];
