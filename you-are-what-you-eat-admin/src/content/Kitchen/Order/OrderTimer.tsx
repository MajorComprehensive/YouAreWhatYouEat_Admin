
import React from 'react'
import { FC, ChangeEvent, useState, useEffect, useCallback } from 'react'
import {
    Box,
    Grid,
    Divider,
    FormControl,
    Card,
    Button,
    styled,
    InputAdornment,
    CardHeader,
    OutlinedInput,
    Table,

    TablePagination,

    TableContainer,

} from '@mui/material'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CheckList from './CheckList'
import { CurOrder } from '@/models/cur_order'

import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

import { useRefMounted } from '@/hooks/useRefMounted';
import { curOrderApi } from '@/queries/cur_order'
import {

    Typography,
    useTheme,

    Avatar,

    alpha,
    ListItem,
    ListItemText,
    List,
    ListItemAvatar
} from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';

import { Chart } from 'src/components/Chart';
import type { ApexOptions } from 'apexcharts';
import Brightness1Icon from '@mui/icons-material/Brightness1';


import { number } from 'yup/lib/locale';
import curOrder from 'pages/kitchen/order';
import { count } from 'console'




const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
        background-color: ${theme.colors.success.main};
        color: ${theme.palette.success.contrastText};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
        box-shadow: ${theme.colors.shadows.success};
  `
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
    ({ theme }) => `
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    background: ${theme.palette.mode === 'dark'
            ? theme.colors.alpha.trueWhite[30]
            : alpha(theme.colors.alpha.black[100], 0.07)
        };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
  `
);

const ButtonSearch = styled(Button)(
    ({ theme }) => `
      margin-right: -${theme.spacing(1)};
  `
);

const OutlinedInputWrapper = styled(OutlinedInput)(
    ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
  `
);

const applyPagination = (
    curOrders: CurOrder[],
    page: number,
    limit: number
): CurOrder[] => {
    return curOrders.slice(page * limit, page * limit + limit);
};


interface CurOrderTableProps {
    lassName?: string;
    CurOrders: CurOrder[];
}

//计算剩余时间(秒)
function calculateTimePast(creationTime: string) 
{
    const difference = Date.now() - Date.parse(creationTime);
    let timeLeft = {};
    let seconds:number;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
      seconds=Math.floor((difference / 1000))
    }

    return seconds;
};

export interface OrderTimerProps {
    orderTime:string, 
    isVip:boolean
  }


const OrderTimer = (props:OrderTimerProps) => {

    const isMountedRef = useRefMounted();

    const getAllData = useCallback(async () => {
        try {
            // let curOrders = await curOrderApi.getCurOrder();
            if (isMountedRef()) {


            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getAllData();
        //console.log("time left:")
        //console.log(calculateTimeLeft(props.orderTime))
    }, [getAllData]);


    const theme = useTheme();

    const chartOptions: ApexOptions = {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%'
                }
            }
        },
        colors: ['#FFA500', '#008000'],
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '%';
            },
            style: {
                colors: [theme.colors.alpha.trueWhite[100]]
            },
            background: {
                enabled: true,
                foreColor: theme.colors.alpha.trueWhite[100],
                padding: 8,
                borderRadius: 4,
                borderWidth: 0,
                opacity: 0.3,
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: theme.colors.alpha.black[70],
                    opacity: 0.5
                }
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                color: theme.colors.alpha.black[50],
                opacity: 0.5
            }
        },
        fill: {
            opacity: 1
        },
        labels: ['已经过', '剩余'],
        legend: {
            labels: {
                colors: theme.colors.alpha.trueWhite[100]
            },
            show: false
        },
        stroke: {
            width: 0
        },
        theme: {
            mode: theme.palette.mode
        }
    };
    let TotalTime=props.isVip?1200:1800;
    let TimePast=calculateTimePast(props.orderTime)
    let RemainingTime=TotalTime-TimePast > 0 ? TotalTime-TimePast : 0
    let m = Math.round(((TotalTime - RemainingTime) / TotalTime) * 100);
    let n = Math.round((RemainingTime / TotalTime) * 100);
    const chartSeries = [m, n];

    return (
        <Card>
                    {
                    RemainingTime>0?
                    <Grid container spacing={2} justifyContent={'space-evenly'}>
                    <Grid
                        xs={12}
                        sm={5}
                        item
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Chart
                            height={250}
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                        />
                    </Grid>
                    <Grid xs={4} sm={4} item display="flex" alignItems="center">
                        <List
                            disablePadding
                            sx={{
                                width: '100%'
                            }}
                        >
                            <ListItem disableGutters>
                                <ListItemAvatarWrapper>
                                    <AccessAlarmIcon/>
                                </ListItemAvatarWrapper>
                                <ListItemText
                                    primary="剩余时间"
                                    primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                    secondary={(RemainingTime).toString()}
                                    secondaryTypographyProps={{
                                        variant: 'subtitle2',
                                        noWrap: true
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

                :

                <Grid xs={4} sm={4} item display="flex" alignItems="center">
                <List
                    disablePadding
                >
                    <ListItem disableGutters>
                        <ListItemAvatarWrapper>
                            <AccessAlarmIcon/>
                        </ListItemAvatarWrapper>
                        <ListItemText
                            primary="已超时"
                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                            secondaryTypographyProps={{
                                variant: 'subtitle2',
                                noWrap: true
                            }}
                        />
                    </ListItem>
                </List>
            </Grid>            

                }
                    
                </Card>

    )
}


export default OrderTimer;
