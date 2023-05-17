import {
  CryptoOrder,
  CryptoFullOrder,
  CryptoSummary
} from '@/models/crypto_order';
import RecentOrdersTable from './RecentOrdersTable';
import OrderSummary from '@/content/Dashboards/Crypto/OrderSummary';
import { Grid } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { queryOrderApi } from 'src/queries/query_order';
import { Console } from 'console';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import OrderSummarySkeleton from '@/content/Dashboards/Crypto/OrderSummarySkeleton';
import RecentOrdersTableSkeleton from './RecentOrdersTableSkeleton';
import CurOrder from '@/content/Kitchen/Order/CurOrder';

function RecentOrders() {
  const isMountedRef = useRefMounted();
  const [orderData, setOrderData] = useState<CryptoFullOrder>(null);

  const getOrderData = useCallback(async () => {
    try {
      const response = await queryOrderApi.getOrder();

      //console.log("--response--");
      //console.log(response);

      if (isMountedRef()) {
        setOrderData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getOrderData();
  }, [getOrderData]);

  //console.log("--orderData--");
  //console.log(orderData);
  if (!orderData)
    return (
      <>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <OrderSummarySkeleton />
          </Grid>
          <Grid item xs={12}>
            <RecentOrdersTableSkeleton />
          </Grid>
        </Grid>
      </>
    );

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <OrderSummary cryptoSummary={orderData.summary} />
        </Grid>
        <Grid item xs={12}>
          
          <RecentOrdersTable cryptoOrders={orderData.orders} />
        </Grid>
        {/*
        <Grid item xs={12}>
          <CurOrder />
        </Grid> 
        */}
        
      </Grid>
    </>
  );
}

export default RecentOrders;
