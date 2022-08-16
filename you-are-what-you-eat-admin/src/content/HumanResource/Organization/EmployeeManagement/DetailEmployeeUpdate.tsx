import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Container, Grid, styled } from '@mui/material';
import ProfileCover from '../Profile/ProfileCover';
import Summary from '../Profile/Summary';
import {
  EmployeeDetail,
  EmployeeEntity,
  EmployeeUpload
} from '@/models/employee';
import { useRefMounted } from '@/hooks/useRefMounted';
import { humanResourceApi } from '@/queries/employee';
import { scheduleApi } from '@/queries/schedule';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import ProfileCoverUpdate from '../Profile/ProfileCoverUpdate';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

export default function DetailEmployeeUpdate({ userId }: { userId: string }) {
  const isMountedRef = useRefMounted();
  const [employee, setEmployee] = React.useState<EmployeeDetail>(null);

  const [open, setOpen] = React.useState(false);

  const [upload, setUpload] = React.useState<EmployeeUpload>(null);

  const handleClose = () => {
    setOpen(false);
  };

  console.log("there is id",userId)

  const getAllData = React.useCallback(async () => {
    try {
      let person = await humanResourceApi.getEmployeeDetail(userId);

      if (isMountedRef()) {
        setEmployee(person);

        setUpload({
          id: person.id,
          name: person.name,
          gender: person.gender,
          occupation: person.occupation,
          cover: person.cover,
          avatar: person.avatar,
          birthday: person.birthday
        } as EmployeeUpload);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  React.useEffect(()=>{

    getAllData();

  },[getAllData])

  const handleClickOpen = () => {
    getAllData();
    setOpen(true);
  };

  return (
    (employee!=null&&upload!=null)&&<div key={employee.id}>
      <ButtonError
        size="large"
        variant="contained"
        onClick={() => {
          handleClickOpen();
        }}
      >
        更新
      </ButtonError>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              size="large"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 4, flex: 1 }} variant="h2" component="div">
              员工详情界面
            </Typography>
            <Button
              autoFocus
              color="inherit"
              size="large"
              onClick={() => {
                const conduct = async () => {
                  let uploaded = {
                    id: upload.id,
                    gender: upload.gender,
                    occupation: upload.occupation,
                    birthday: upload.birthday,
                    avatar: upload.avatar,
                    cover: upload.cover,
                    name: upload.name
                  } as EmployeeUpload;

                  return await humanResourceApi.postEmployee(uploaded);
                };

                conduct()
                  .then((value) => {
                    alert('更新成功：' + value);

                    handleClose();
                  })
                  .catch((value) => {
                    alert('更新失败：' + value);
                  });
              }}
            >
              保存
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 3 }} maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12} md={8}>
              <ProfileCoverUpdate
                upload={upload}
                setSelectedUpload={(uploaded: EmployeeUpload) => {
                  setUpload(uploaded);
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Summary user={employee} />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}
