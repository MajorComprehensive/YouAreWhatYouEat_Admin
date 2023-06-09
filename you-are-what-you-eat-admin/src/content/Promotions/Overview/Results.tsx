import { useState, ReactElement, Ref, forwardRef } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  FormControl,
  Select,
  InputLabel,
  InputAdornment,
  styled
} from '@mui/material';
import Link from 'src/components/Link';

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Promotion, PromotionStatus } from 'src/models/promotion';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format } from 'date-fns';
import { promotionsApi } from '@/queries/promotions';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const formatDate = (date: Date) => {
  try {
    return format(date, 'MMMM dd yyyy');
  } catch {
    return '';
  }
};

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

interface ResultsProps {
  promotions: Promotion[];
}

interface Filters {
  status?: PromotionStatus;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getPromotionStatusLabel = (
  promotionStatus: PromotionStatus
): JSX.Element => {
  const map = {
    ready: {
      text: '未开始',
      color: 'warning'
    },
    running: {
      text: '进行中',
      color: 'success'
    },
    completed: {
      text: '已结束',
      color: 'primary'
    }
  };

  const { text, color }: any = map[promotionStatus];

  return (
    <Label color={color}>
      <b>{text}</b>
    </Label>
  );
};

const applyFilters = (
  promotions: Promotion[],
  query: string,
  filters: Filters
): Promotion[] => {
  return promotions.filter((promotions) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (promotions[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && promotions.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && promotions[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (
  promotions: Promotion[],
  page: number,
  limit: number
): Promotion[] => {
  return promotions.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ promotions }) => {
  const [selectedItems, setSelectedPromotions] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  // const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: '全部'
    },
    {
      id: 'running',
      name: t('进行中')
    },
    {
      id: 'completed',
      name: t('已结束')
    },
    {
      id: 'ready',
      name: t('未开始')
    }
  ];

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

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

  const handleSelectAllPromotions = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedPromotions(
      event.target.checked ? promotions.map((promotion) => promotion.id) : []
    );
  };

  const handleSelectOnePromotion = (
    _event: ChangeEvent<HTMLInputElement>,
    promotionId: string
  ): void => {
    if (!selectedItems.includes(promotionId)) {
      setSelectedPromotions((prevSelected) => [...prevSelected, promotionId]);
    } else {
      setSelectedPromotions((prevSelected) =>
        prevSelected.filter((id) => id !== promotionId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredPromotions = applyFilters(promotions, query, filters);
  const paginatedPromotions = applyPagination(filteredPromotions, page, limit);
  const selectedSomePromotions =
    selectedItems.length > 0 && selectedItems.length < promotions.length;
  const selectedAllPromotions = selectedItems.length === promotions.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deletePromotionId, setDeletePromotionId] = useState('');

  const handleConfirmDelete = (promotion_id?: string) => {
    setOpenConfirmDelete(true);
    setDeletePromotionId(promotion_id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setDeletePromotionId('');
  };

  const handleDeleteCompleted = () => {
    promotionsApi
      .deletePromotionById(deletePromotionId)
      .then((value) => {
        alert('删除成功' + value);
      })
      .catch((value) => {
        alert('删除失败' + value);
      });

    // try {

    // }
    // catch(err) {
    //   alert("删除失败" + err);
    // }
    setOpenConfirmDelete(false);
    setDeletePromotionId('');
  };

  return (
    <>
      <Card
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid alignItems="center" container spacing={3}>
          <Grid item xs={12} lg={7} md={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              sx={{
                m: 0
              }}
              onChange={handleQueryChange}
              placeholder={t('输入活动名查找活动')}
              value={query}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={5} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('活动状态')}</InputLabel>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                label={t('Status')}
              >
                {statusOptions.map((statusOption) => (
                  <MenuItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
      <Card>
        <Box pl={2} display="flex" alignItems="center">
          <Checkbox
            checked={selectedAllPromotions}
            indeterminate={selectedSomePromotions}
            onChange={handleSelectAllPromotions}
          />
          {
            <Box
              flex={1}
              p={2}
              display={{ xs: 'block', sm: 'flex' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('已显示')}:
                </Typography>{' '}
                <b>{paginatedPromotions.length}</b> <b>{t('个促销活动')}</b>
              </Box>
              <TablePagination
                component="div"
                count={filteredPromotions.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          }
        </Box>
        <Divider />

        {paginatedPromotions.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t('当前找不到任何促销活动')}
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('#')}</TableCell>
                    <TableCell>{t('日期')}</TableCell>
                    <TableCell>{t('描述')}</TableCell>
                    <TableCell>{t('状态')}</TableCell>
                    <TableCell align="center">{t('操作')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPromotions.map((promotion) => {
                    const isPromotionSelected = selectedItems.includes(
                      promotion.id
                    );
                    return (
                      <TableRow
                        hover
                        key={promotion.id}
                        selected={isPromotionSelected}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Checkbox
                              checked={isPromotionSelected}
                              onChange={(event) =>
                                handleSelectOnePromotion(event, promotion.id)
                              }
                              value={isPromotionSelected}
                            />
                            <Box pl={1}>
                              <Typography noWrap variant="subtitle2">
                                {promotion.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {formatDate(promotion.start)}
                          </Typography>
                          <Typography noWrap variant="subtitle1">
                            {t('截止至')} <b>{formatDate(promotion.end)}</b>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h5">
                              {promotion.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {getPromotionStatusLabel(promotion.status)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('查看详情')} arrow>
                              <IconButton
                                component={Link}
                                href={`/promotions/overview/single/${promotion.id}`}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('删除活动')} arrow>
                              <IconButton
                                disabled={promotion.status === 'running'}
                                onClick={() =>
                                  handleConfirmDelete(promotion.id)
                                }
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
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
                count={filteredPromotions.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('你确定要删除该促销活动吗？')}
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t('此操作是不可逆的')}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('再想想')}
            </Button>
            <ButtonError
              onClick={() => {
                handleDeleteCompleted();
                window.location.reload();
              }}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('确认删除')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  promotions: PropTypes.array.isRequired
};

Results.defaultProps = {
  promotions: []
};

export default Results;
