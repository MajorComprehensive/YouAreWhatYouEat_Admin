import PageHeader from 'src/content/Energy/Overview/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Head from 'next/head';

import SidebarLayout from 'src/layouts/SidebarLayout';

import { Grid } from '@mui/material';

import EnergyPanel from '@/content/Energy/Overview/EnergyPanel';
import EnergySurplus from '@/content/Energy/Overview/EnergySurplus';
import OverallUsage from 'src/content/Energy/Overview/OverallUsage';
import TypesOverview from '@/content/Energy/Overview/EnergyTypesOverview';

function DataDisplayChartsLarge() {

  return (
    <>
      <Head>
        <title>能源管理</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <EnergyPanel />
        </Grid>
        <Grid item md={6} xs={12}>
          <OverallUsage />
        </Grid>
        <Grid item md={6} xs={12}>
          <TypesOverview />
        </Grid>
        <Grid item xs={12}>
          <EnergySurplus />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

DataDisplayChartsLarge.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default DataDisplayChartsLarge;