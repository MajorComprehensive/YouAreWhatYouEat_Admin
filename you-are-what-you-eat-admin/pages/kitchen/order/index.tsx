import RecentOrders from '@/content/Management/Transactions/RecentOrders';

import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Kitchen/Order/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';
import LiveOrderSchedule from '@/content/Kitchen/Order/LiveOrderSchedule';

function curOrder() {


  return (
    <>
      <Head>
        <title>实时订单管理</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <LiveOrderSchedule />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}

curOrder.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);


export default curOrder;


