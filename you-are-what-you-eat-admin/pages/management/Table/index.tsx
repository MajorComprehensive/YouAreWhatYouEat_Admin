import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Table/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import TablePage from '@/content/Management/Table/TablePage';

function ApplicationsVIP() {
  return (
    <>
      <Head>
        <title>场地管理</title>
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
            <TablePage />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsVIP.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ApplicationsVIP;
