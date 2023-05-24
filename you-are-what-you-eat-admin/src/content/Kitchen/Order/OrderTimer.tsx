
import React from 'react'
import { FC, ChangeEvent, useState, useEffect, useCallback, useRef } from 'react'
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
import GaugeChart from 'react-gauge-chart';
import {

    alpha,
    ListItem,
    ListItemText,
    List,
    ListItemAvatar
} from '@mui/material';


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
    table : string
  }


const OrderTimer = (props:OrderTimerProps) => {
    const intervalRef = useRef<any>(null);
  
    const [RemainingTime, changeRemainingTime] = useState(0);
    const [counting, changeCounting] = useState(false);
    
    // 组件卸载时清除计时器
    useEffect(() => {
      return () => {
        clearInterval(intervalRef.current);
      };
    }, []);
  
    useEffect(() => {
      if (RemainingTime > 0 && !counting) {
        startTimer();
        console.log("Timer start");
      } else if (RemainingTime === 0) {
        clearInterval(intervalRef.current);
      }
    }, [counting]);

    function startTimer()
    {
        changeCounting(true);
        intervalRef.current = setInterval(() => {
            changeRemainingTime((preCount) => preCount - 1);
        }, 1000);
        console.log("Timer start");
    }

    function delay()
    {
        changeRemainingTime(RemainingTime+600);
    }

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
        changeRemainingTime(TotalTime-TimePast > 0 ? TotalTime-TimePast : 0);
        startTimer();
    }, [getAllData]);

    let TotalTime=1800;
    let TimePast=calculateTimePast(props.orderTime)

    return (
        
        <Card>
                    <Grid container spacing={2} justifyContent={'space-evenly'}>
                    <Grid
                        xs={12}
                        sm={5}
                        item
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <GaugeChart 
                            id="gauge-chart1" 
                            textColor="#010101" 
                            percent={RemainingTime / TotalTime} 
                            arcPadding={0} 
                            cornerRadius={0} 
                            nrOfLevels={2} 
                            colors={["#FF0017", "#eceaea"]} 
                            arcsLength={[RemainingTime / TotalTime, 1-RemainingTime / TotalTime]} 
                            animate={true}
                        />
                    </Grid>
                    <Grid xs={4} sm={4} item display="flex" alignItems="center">
                        <List
                            disablePadding
                            sx={{
                                width: '100%'
                            }}
                        >
                            {
                               RemainingTime>0? 
                                <ListItem disableGutters>
                                <ListItemAvatarWrapper>
                                    <AccessAlarmIcon/>
                                </ListItemAvatarWrapper>
                                <ListItemText
                                    primary="剩余时间"
                                    primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                    secondary={Math.floor(RemainingTime/60).toString()+"分"+(RemainingTime%60).toString()+"秒"}
                                    secondaryTypographyProps={{
                                        variant: 'subtitle2',
                                        noWrap: true
                                    }}
                                />
                            </ListItem>
                            :
                            <ListItem disableGutters>
                                <ListItemAvatarWrapper>
                                    <AccessAlarmIcon color='error'/>
                                </ListItemAvatarWrapper>
                                <ListItemText
                                    primary="该订单已超时!"
                                    primaryTypographyProps={{ variant: 'h5', noWrap: true ,color:'error'}}
                                    secondary="请尽快处理"
                                    secondaryTypographyProps={{
                                        variant: 'subtitle2',
                                        noWrap: true
                                    }}
                                />
                            </ListItem>
                            }
                            <ListItem disableGutters>
                                <ListItemAvatarWrapper>
                                    <AccessAlarmIcon/>
                                </ListItemAvatarWrapper>
                                <ListItemText
                                    primary="创建时间"
                                    primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                    secondary={props.orderTime}
                                    secondaryTypographyProps={{
                                        variant: 'subtitle2',
                                        noWrap: false
                                    }}
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText
                                    primary={"桌号：" + props.table}
                                    primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid xs={12} columnSpacing={{ xs: 1, sm: 2, md: 3 }} item display="flex" justifyContent="center"  alignItems="center">
                        {
                            RemainingTime>0?
                            <Button onClick={delay}>延迟10分钟</Button>
                            :
                            <Button disabled={true} color="error">订单已超时</Button>
                        }
                    </Grid>
                </Grid>
                    
                </Card>

    )
}


export default OrderTimer;
