import React from 'react';

import { ChangeEvent, useState, useEffect, useCallback } from 'react';

import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  Card,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  styled,
  InputAdornment,
  Typography,
  useTheme,
  CardHeader,
  OutlinedInput
} from '@mui/material';

import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { StockInfo, SurplusUpload } from '@/models/stock_info';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';


import { stockInfoApi } from '@/queries/stock';
import { useRefMounted } from '@/hooks/useRefMounted';

const applyPagination = (
  stockInfoes: StockInfo[],
  page: number,
  limit: number
): StockInfo[] => {
  return stockInfoes.slice(page * limit, page * limit + limit);
};








const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
  `
);

const ButtonSearch = styled(Button)(
  ({ theme }) => `
      margin-right: -${theme.spacing(1)};
  `
);




const StockInfoesTable = () => {




  const isMountedRef = useRefMounted();
  const [StockInfoes, setStockInfoes] = useState<StockInfo[]>([]);
  const [SearchStockInfoes, setSearchStockInfoes] = useState<StockInfo[]>([]);

  const getAllData = useCallback(async () => {
    try {

      let stockInfoes = await stockInfoApi.getStockInfo();
      if (isMountedRef()) {
        setStockInfoes(stockInfoes);
        setSearchStockInfoes(stockInfoes);
      }
    } catch (err) {
      alert(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);




  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [idChange, setidChange] = useState<string>('');
  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);

  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();



  const paginatedPromotions = applyPagination(StockInfoes, page, limit);

  var Search: string;

  let newM: StockInfo[] = [];
  const handleSearchChange = (e) => {
    newM = [];
    Search = e.target.value;
    SearchStockInfoes.map((item) => {
      if (item.ing_name.indexOf(Search) != -1)
        newM.push(item);
    })
  }
  const handleSearchClick = () => {
    setStockInfoes(newM);
  }
  let s: SurplusUpload = {
    record_id: "",
    surplus: 0
  };
  const surplusChange = (e) => {
    s.surplus = parseInt(e.target.value);

  }
  console.log(StockInfoes);
  return (
    <Card>
      {(

        <CardHeader
          action={
            <FormControl variant="outlined" fullWidth>
              <OutlinedInputWrapper
                onChange={handleSearchChange}
                type="text"
                placeholder="输入原料名称"
                endAdornment={
                  <InputAdornment position="end">
                    <ButtonSearch variant="contained" size="small" onClick={handleSearchClick} >
                      搜索
                    </ButtonSearch>

                  </InputAdornment>
                }
                startAdornment={
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          }
          title="菜品信息列表"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>

              <TableCell>采购编号</TableCell>
              <TableCell>原料名称</TableCell>
              <TableCell >日期</TableCell>
              <TableCell>采购量</TableCell>
              <TableCell >剩余量</TableCell>
              <TableCell >操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {paginatedPromotions.map((stockInfo) => {
              return (
                <TableRow
                  hover
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {stockInfo.record_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {stockInfo.ing_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {stockInfo.date}
                    </Typography>

                  </TableCell>
                  <TableCell >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {stockInfo.amount}

                    </Typography>

                  </TableCell>
                  <TableCell >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {(stockInfo.surplus)}

                    </Typography>

                  </TableCell>

                  <TableCell >
                    <Tooltip title="编辑" arrow onClick={() => {

                      setidChange(stockInfo.record_id);
                      setOpen(true);
                    }}>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>剩余量编辑</DialogTitle>
                      <DialogContent>

                        <TextField
                          onChange={surplusChange}
                          autoFocus
                          margin="dense"
                          id="id"
                          label="剩余"
                          fullWidth
                          variant="standard"
                        />

                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>退出</Button>
                        <Button onClick={() => {

                          const conduct = async () => {
                            s.record_id = idChange;
                            return stockInfoApi.updateStock(
                              s
                            );
                          }

                          conduct().then((value) => {

                            alert("修改成功：" + value);

                          }).catch((value) => {

                            alert("修改失败：" + value);
                          });
                          setOpen(false);
                          window.location.reload();

                        }} >确定</Button>
                      </DialogActions>
                    </Dialog>
                    <Tooltip title="删除" arrow >
                      <IconButton
                        onClick={() => {
                          const conduct = async () => {
                            console.log(stockInfoApi);
                            console.log(stockInfo.record_id);

                            return stockInfoApi.delStock(
                              parseInt(stockInfo.record_id))
                          }
                          conduct().then((value) => {
                            alert("成功：" + value);
                            window.location.reload();
                          }).catch((value) => {

                            alert("失败：" + value);
                          });
                        }}
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"

                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={StockInfoes.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );

};

StockInfoesTable.propTypes = {
  stockInfoes: PropTypes.array.isRequired
};

StockInfoesTable.defaultProps = {
  stockInfoes: []
};

export default StockInfoesTable;
