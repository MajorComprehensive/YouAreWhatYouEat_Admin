import { useState, useEffect, useCallback } from 'react';

import SidebarLayout from 'src/layouts/SidebarLayout';

import Head from 'next/head';
import PageHeader from 'src/content/Energy/Details/PageHeader';
import Footer from 'src/components/Footer';
import Statistics from 'src/content/Energy/Details/Statistics';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import type { OriginalSensorData } from 'src/models/energy'
import { energyApi } from 'src/queries/energy'
import Results from 'src/content/Energy/Details/AudienceOverview';
import { count } from 'src/utils/array'

function SensorDataCards() {
  const isMountedRef = useRefMounted();
  const [originalData, setOriginalData] = useState<OriginalSensorData[]>([]);

  const getOriginalData = useCallback(async () => {
    try {
      const response = await energyApi.getOriginalSensorData();

      if (isMountedRef()) {
        setOriginalData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getOriginalData();
  }, [getOriginalData]);

  var water = count(originalData, (e) => e.sensor_type === '水表');
  var power = count(originalData, (e) => e.sensor_type === '电表');;
  var gas = count(originalData, (e) => e.sensor_type === '燃气');;

  return (
    <>
      <Head>
        <title>能源详情</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          {Statistics(water, power, gas)}
        </Grid>
        {originalData.map((data) => (
          <Grid item xs={12}>
          <Results 
            logs={data.logs} 
            type={data.sensor_type} 
            id={data.sensor_id}
            model={data.sensor_model}
            location={data.sensor_location}
          />
        </Grid>
        ))}
      </Grid>
      <Footer />
    </>
  );
}

SensorDataCards.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default SensorDataCards;