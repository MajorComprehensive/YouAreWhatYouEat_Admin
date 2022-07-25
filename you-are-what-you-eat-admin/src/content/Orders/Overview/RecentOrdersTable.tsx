import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import { Order, OrderStatus } from 'src/models/order';
import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
// import BulkActions from 'src/content/Management/Commerce/BulkActions';

interface RecentOrdersTableProps {
  className?: string;
  orders: Order[];
}

interface Filters {
  status?: OrderStatus;
}

const getStatusLabel = (orderStatus: OrderStatus): JSX.Element => {
  const map = {
    failed: {
      text: '已取消',
      color: 'error'
    },
    completed: {
      text: '已完成',
      color: 'success'
    },
    running: {
      text: '已支付',
      color: 'warning'
    }
  };

  const { text, color }: any = map[orderStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  orders: Order[],
  filters: Filters
): Order[] => {
  return orders.filter((order) => {
    let matches = true;

    if (filters.status && order.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  orders: Order[],
  page: number,
  limit: number
): Order[] => {
  return orders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ orders }) => {
  const { t }: { t: any } = useTranslation();

  const [selectedOrders, setselectedOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: t('已完成')
    },
    {
      id: 'running',
      name: t('已支付')
    },
    {
      id: 'failed',
      name: t('已取消')
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setselectedOrders(
      event.target.checked
        ? orders.map((order) => order.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    _event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedOrders.includes(cryptoOrderId)) {
      setselectedOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setselectedOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(orders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedOrders.length > 0 &&
    selectedOrders.length < orders.length;
  const selectedAllCryptoOrders =
    selectedOrders.length === orders.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          {/* <BulkActions /> */}
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('Status')}</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label={t('Status')}
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title={t('全部订单')}
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell>{t('订单号')}</TableCell>
              <TableCell>{t('创建时间')}</TableCell>
              <TableCell>{t('桌号')}</TableCell>
              <TableCell align="right">{t('总价格')}</TableCell>
              <TableCell align="right">{t('状态')}</TableCell>
              <TableCell align="right">{t('操作')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((order) => {
              const isCryptoOrderSelected = selectedOrders.includes(
                order.id
              );
              return (
                <TableRow
                  hover
                  key={order.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event) =>
                        handleSelectOneCryptoOrder(event, order.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {order.id}
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
                      {format(order.creation_time, 'MMM dd yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(order.creation_time, 'hh:mm:ss')}
                    </Typography>
                  </TableCell>
                  
                  {/*桌号栏*/}
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {order.table_id}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {22211}
                    </Typography> */}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {order.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {`优惠 ￥${order.discount_price}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {getStatusLabel(order.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('Edit Order')} arrow>
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
                    <Tooltip title={t('Delete Order')} arrow>
                      <IconButton
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
          count={filteredCryptoOrders.length}
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

RecentOrdersTable.propTypes = {
  orders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  orders: []
};

export default RecentOrdersTable;