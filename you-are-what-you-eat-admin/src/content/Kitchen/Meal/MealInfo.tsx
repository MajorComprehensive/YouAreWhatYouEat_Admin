import { Card } from '@mui/material';
import { Grid } from '@mui/material';


import React from 'react';

import MealInfoTable from './MealInfoTable'


function AllMealInfoes() {


/**
     <Card>
      <MealInfoTable />
    </Card>
 */

  return (

    <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="stretch"
    spacing={4}
  >
    <Grid item xs={12}>
      <MealInfoTable />
    </Grid>
  </Grid>
  );

}

export default AllMealInfoes;
