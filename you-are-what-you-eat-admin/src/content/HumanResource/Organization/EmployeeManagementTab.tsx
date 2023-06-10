import {
  useState,
  MouseEvent,
  ChangeEvent,
  useCallback,
  useEffect
} from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  Divider,
  Button,
  Avatar,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  styled,
  TextField,
  CardMedia
} from '@mui/material';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DetailEmployeePopup from './EmployeeManagement/DetailEmployeePopup';
import {
  EmployeeDetail,
  EmployeeEntity,
  EmployeeUpload,
  Salary
} from '@/models/employee';
import { humanResourceApi } from '@/queries/employee';
import { salaryApi } from '@/queries/salary';
import { useRefMounted } from '@/hooks/useRefMounted';
import ProfileCoverNew from './Profile/ProfileCoverNew';
import { compareAsc, compareDesc, parse } from 'date-fns';

function EmployeeManagementTab() {
  const isMountedRef = useRefMounted();
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [levels, setLevels] = useState<Salary[]>([]);

  const getAllData = useCallback(async () => {
    try {
      let employees = await humanResourceApi.getEmployees();

      let levels = await salaryApi.getSalary();

      if (isMountedRef()) {
        setEmployees(employees);
        setLevels(levels);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const handleChangePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [upload, setUpload] = useState<EmployeeUpload>({
    id: null,
    name: '',
    gender: '',
    occupation: '',
    cover: 'http://dummyimage.com/800x300',
    avatar: 'http://dummyimage.com/150x150',
    birthday: '2001-01-01'
  } as EmployeeUpload);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">餐厅员工级别表</Typography>
          <Typography variant="subtitle2">餐厅员工职级如下所示</Typography>
        </Box>

        <Card>
          <CardHeader
            subheaderTypographyProps={{}}
            titleTypographyProps={{}}
            title="员工职位表"
            subheader="职位如下所示"
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>职位</TableCell>

                  <TableCell>人数</TableCell>
                  <TableCell>薪资</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels.map((level: Salary) => (
                  <TableRow key={level.occupation} hover>
                    <TableCell>{level.occupation}</TableCell>
                    <TableCell>{level.count}</TableCell>
                    <TableCell>{level.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">添加新员工</Typography>
          <Typography variant="subtitle2">添加员工</Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <Grid container>
                <Grid item xs={12}>
                  <ProfileCoverNew
                    upload={upload}
                    setSelectedUpload={(uploaded: EmployeeUpload) => {
                      setUpload(uploaded);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth={true}
                    disabled={
                      !upload.name ||
                      upload.name === '' ||
                      !upload.gender ||
                      upload.gender === '' ||
                      !upload.occupation ||
                      upload.occupation === '' ||
                      !upload.birthday ||
                      upload.birthday === '' ||
                      !upload.avatar ||
                      upload.avatar === '' ||
                      !upload.cover ||
                      upload.cover === ''||
                      !upload.password ||
                      upload.password === ''||
                      !upload.email ||
                      upload.email === ''
                    }
                    onClick={() => {
                      console.log(upload);

                      if(upload.gender!='男'&&upload.gender!='女'){

                        alert("性别必须是男或者是女")
                        return;
                      }
      
                      if(compareAsc(parse(upload.birthday,"yyyy-MM-dd",Date.now()),Date.now())>=0){
      
                        alert("生日不允许超过当前日期")
                        return;
                      }


                      const addEmployee = async () => {

                          return await humanResourceApi.postEmployee({
                            id: null,
  
                            name: upload.name,
                            gender: upload.gender,
                            birthday: upload.birthday,
                            occupation: upload.occupation,
  
                            cover: upload.cover,
                            avatar: upload.avatar
                          } as EmployeeUpload);

                      };

                      const conduct = async () => {
                        
                        await addEmployee();

                        const newAddEmployee = await humanResourceApi.getEmployees();
                        const newId = newAddEmployee.find((employee) => {
                          return employee.name === upload.name 
                          && employee.gender === upload.gender 
                          && employee.birthday === upload.birthday
                          && employee.occupation === upload.occupation
                        }).id;

                        upload.id = newId;

                        console.log("this is upload",upload);

                        return await humanResourceApi.registerEmployee({
                          ...upload
                        });
                      };

                      

                      conduct()
                        .then((value) => {

                          if(value==="OK"){
                            alert('添加成功：' + value+"\n请在表格中查看点击详情查看员工");
                            window.location.reload();
                          }

                          else{

                            if(upload.id){

                              const callback=()=>{
                                upload.id=null;
                                
                              }

                              humanResourceApi.deleteEmployee(upload.id).then((value)=>{
                                callback();
                              }).catch((value)=>{
                                callback();
                              })

                            }

                            alert('添加失败：' + value);
                          }

                          
                        })
                        .catch((value) => {
                          alert('添加失败：' + value);
                        });
                    }}
                  >
                    <UploadTwoToneIcon />
                    提交新员工
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">全体员工</Typography>
          <Typography variant="subtitle2">管理员工信息</Typography>
        </Box>

        <Card>
          <CardHeader
            subheaderTypographyProps={{}}
            titleTypographyProps={{}}
            title="员工信息"
            subheader="点击查看员工详细信息"
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>员工号</TableCell>
                  <TableCell>员工头像</TableCell>
                  <TableCell>员工名</TableCell>
                  <TableCell>员工性别</TableCell>
                  <TableCell>员工职位</TableCell>
                  {/* <TableCell>月排班数</TableCell> */}
                  <TableCell>获奖次数</TableCell>
                  <TableCell align="right">删除操作</TableCell>
                  <TableCell align="right">点击查看</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.sort((a,b)=>{
                if(a.id===b.id){
                  return 0;
                }
                return a.id<b.id? -1:1;
              })
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>
                        <Avatar src={employee.avatar} />
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.gender}</TableCell>
                      <TableCell>{employee.occupation}</TableCell>
                      {/* <TableCell>{employee.attendance_rate}</TableCell> */}
                      <TableCell>{employee.award_times}</TableCell>
                      <TableCell align="right">
                        <Tooltip placement="top" title="Delete" arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => {
                              const conduct = async () => {
                                return humanResourceApi.deleteEmployee(
                                  employee.id
                                );
                              };

                              conduct()
                                .then((value) => {
                                  alert('删除结果：' + value + '\n');
                                  window.location.reload();
                                })
                                .catch((value) => {
                                  alert('删除失败：' + value);
                                });
                            }}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <DetailEmployeePopup key={employee.id} userId={employee.id} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={2}>
            <TablePagination
              component="div"
              count={employees.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default EmployeeManagementTab;

export async function getServerSideProps() {
  const employees = await humanResourceApi.getEmployees();

  const levels = await salaryApi.getSalary();

  return { props: { employees: employees, levels: levels } };
}
