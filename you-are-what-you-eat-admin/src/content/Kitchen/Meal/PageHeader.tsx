import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import * as React from 'react';

import { GenerateBase64 } from '@/utils/image';

import DialogActions from '@mui/material/DialogActions';
import { MealInfoAdd } from '@/models/meal_info';
import { mealInfoApi } from '@/queries/meal';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone'

import { useTranslation } from 'react-i18next';

import { queryIngredientApi } from '@/queries/query_ingredient';
import { IngredientInfo } from '@/models/ingredient_info';

import { useRefMounted } from '@/hooks/useRefMounted';
import addMealCheckboxes from './addMealCheckBox';
import addMealTagCheckboxes from './addMealTagCheckBox';

function calDishId(): number {
  var curDate = new Date();
  var year = curDate.getFullYear();
  var mth  = curDate.getMonth() + 1;
  var date = curDate.getDate();
  var hour = curDate.getHours();
  var min  = curDate.getMinutes();
  var sec  = curDate.getSeconds();
  var ystr: string = year.toString();
  var mstr: string = mth >= 10 ? mth.toString() : "0" + mth.toString();
  var dstr: string = date >= 10 ? date.toString() : "0" + date.toString();
  var hstr: string = hour >= 10 ? hour.toString() : "0" + hour.toString();
  var mnstr: string = min >= 10 ? min.toString() : "0" + min.toString();
  var sstr: string = sec >= 10 ? sec.toString() : "0" + sec.toString();
  return Number(ystr + mstr + dstr + hstr + mnstr + sstr);
}

const Input = styled('input')({
  display: 'none'
});

const CardCover = styled(Card)(
  ({ theme }) => `
      position: relative;
  
      .MuiCardMedia-root {
        height: ${theme.spacing(26)};
      }
  `
);
const CardCoverAction = styled(Box)(
  ({ theme }) => `
      position: absolute;
      right: ${theme.spacing(2)};
      bottom: ${theme.spacing(2)};
  `
);


function PageHeader() {
  const { t }: { t: any } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [newPromotionCover, setNewPromotionCover] = useState<string>('');
  const [judgePrice, setJudgePrice] = React.useState(false);
  const [ing, setIng] = useState<IngredientInfo[]>([]);
  const isMountedRef = useRefMounted();
  const [m, setM] = useState<MealInfoAdd>({
    id: 123,
    dis_name: '123',
    price: 123,
    description: '123',
    tags: [""],
    picture: null,
    video: "",
    ingredient: [""]
  });
  const [ingNames, setIngNames] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([])


  const getAllData = useCallback(async () => {
    try {
      let ig = await queryIngredientApi.getIngredientList('');
      if (isMountedRef()) {
        setIng(ig);
        setIngNames(ig.map((ing) => ing.ingr_name))
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const nameInputChange = (e) => {
    setM({...m, dis_name: e.target.value});
  }
  const priceInputChange = (e) => {
    setM({...m, price: Number(e.target.value)});
    var rex = /^[0-9]+$/;//正则表达式
    var flag = (rex.test(m.price.toString()));//通过表达式进行匹配
    if (flag) {
      setJudgePrice(false);
    }

    else {
      setJudgePrice(true);
    }
  }
  const descriptionInputChange = (e) => {
    setM({...m, description: e.target.value});
  }
  const tagsInputChange = (e) => {
    setM({...m, tags: e.target.value.split(" ")});
  }

  const viedoInputChange = (e) => {
    setM({...m, video: e.target.value})
  }

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          菜品信息
        </Typography>
        <Typography variant="subtitle2">
          查看并编辑所有菜品信息
        </Typography>
      </Grid>

      <Grid item>

        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={handleClickOpen}
        >
          新增菜品
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>菜品信息</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="菜品名称"
              fullWidth
              variant="standard"
              onChange={nameInputChange}

            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="菜品价格"
              fullWidth
              variant="standard"
              onChange={priceInputChange}
              helperText="请输入合法数字"
              error={judgePrice}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="菜品描述"
              fullWidth
              variant="standard"
              onChange={descriptionInputChange}
            />
            {addMealCheckboxes(ingNames, setIngNames)}
            {addMealTagCheckboxes(selectedTags, setSelectedTags)}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="视频链接"
              fullWidth
              variant="standard"
              onChange={viedoInputChange}
            />

            <Grid item xs={12}>
              <Box m={2}>
                <Box pb={1} mb={1}>
                  <b>{t('菜品图片')}:</b>
                </Box>
                <CardCover>
                  <CardMedia image={newPromotionCover} />
                  <CardCoverAction>
                    <Input accept="image/*" id="change-cover"
                      multiple
                      type="file"
                      onChange={(event) => {
                        if (event.target.files.length > 0) {
                          let file = event.target.files[0];
                          GenerateBase64(file, (url: string) => {
                            setNewPromotionCover(url);
                          });
                        }
                      }} />
                    <label htmlFor="change-cover">
                      <Button
                        startIcon={<UploadTwoToneIcon />}
                        variant="contained"
                        component="span"
                      >
                        上传菜品图片
                      </Button>
                    </label>
                  </CardCoverAction>
                </CardCover>
              </ Box>
            </Grid>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>退出</Button>
            <Button onClick={() => {
              const conduct = async () => {
                // 获取当前时间作为菜品 id 提交
                setM({...m, picture: newPromotionCover, id: calDishId()});
                console.log(m.tags);
                return mealInfoApi.addMeal(m);
              }
              var rex = /^[0-9]+$/;//正则表达式
              var flag = (rex.test(m.price.toString()) && rex.test(m.id.toString()));//通过表达式进行匹配

              if (flag) {
                conduct().then((value) => {
                  alert("增加成功：" + value);
                  window.location.reload();

                }).catch((value) => {

                  alert("增加失败：" + value);
                });
              } else {
                alert("数据类型不合法");
              }



            }}>确定</Button>
          </DialogActions>
        </Dialog>
      </Grid>



    </Grid>
  );

}

export default PageHeader;
