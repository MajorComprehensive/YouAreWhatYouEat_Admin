import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip, useTheme } from '@mui/material';

import {
  CryptoDishOrder,
  CryptoDishOrderStatus,
  CryptoAllDishOrder
} from '@/models/crypto_dishOrder';
import { CryptoOrder } from '@/models/crypto_order';
import { Grid } from '@mui/material';
import DishOrderTable from './DishOrderTable';
import { useState, useEffect, useCallback } from 'react';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { queryDishOrderApi } from '@/queries/query_dishOrder';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export interface DialogIDProps {
  id: string;
  cryptoOrder:CryptoOrder;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function FullOrderView(props: DialogIDProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

  const isMountedRef = useRefMounted();
  const [dishOrderData, setDishOrderData] = useState<CryptoAllDishOrder>(null);

  const getDishOrderData = useCallback(async () => {
    try {
      const response = await queryDishOrderApi.getDishOrder(props.id);

      if (isMountedRef()) {
        setDishOrderData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getDishOrderData();
  }, [getDishOrderData]);

  if (!dishOrderData) {
    return (
      <Stack spacing={1}>
        <Skeleton animation="wave" variant="text" />
      </Stack>
    );
  }

  return (
    <div>
      <Tooltip title="查看订单">
      <IconButton
        sx={{
          '&:hover': {
            background: theme.colors.primary.lighter
          },
          color: theme.palette.primary.main
        }}
        color="inherit"
        size="small"
        onClick={handleClickOpen}
      >
        <RemoveRedEyeIcon fontSize="small" />
      </IconButton>
      </Tooltip>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={'md'}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          订单：{props.id}     总金额：{props.cryptoOrder.total_price}
        </BootstrapDialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <DishOrderTable cryptoDishOrder={dishOrderData.data} cryptoOrder={props.cryptoOrder}/>
          </Grid>
        </Grid>
      </BootstrapDialog>
    </div>
  );
}
