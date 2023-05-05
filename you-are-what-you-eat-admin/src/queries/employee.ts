import {
  EmployeeDetail,
  EmployeeUpload,
  EmployeeEntity
} from '@/models/employee';
import { Base64ToData } from '@/utils/image';

import { DeleteApi, GetApi, PostApi } from '@/utils/requests';
import axios from 'axios';
import GlobalConfig from '@/utils/config';
class HumanResourceApi {
  public getEmployees = async () => {
    return (await GetApi('Employee/GetAllEmployeeInfo'))
      .data as EmployeeEntity[];
  };

  public getEmployeeDetail = async (id: string) => {
    return (
      await GetApi('Employee/GetOneEmployeeInfo', {
        id: id
      })
    ).data as EmployeeDetail;
  };

  public postEmployee = async (employee: EmployeeUpload) => {
    employee.avatar = Base64ToData(employee.avatar);
    employee.cover = Base64ToData(employee.cover);


    try{

    const user = await PostApi('Employee/PostEmployeeInfo', {
      avatar: employee.avatar.includes('/images/') ? null : employee.avatar,
      birthday: employee.birthday,
      cover: employee.cover.includes('/images/') ? null : employee.cover,
      gender: employee.gender,
      id: employee.id && employee.id != '' ? employee.id : null,
      name: employee.name,
      occupation: employee.occupation
    })

    return user.statusText as string;

    }catch(e){

      return "OK";

    }

  };

  public deleteEmployee = async (id: string) => {
    return (
      await DeleteApi('Employee/DeleteEmployeeInfo', {
        id: id
      })
    ).statusText as string;
  };

  public registerEmployee = async (employee: EmployeeUpload) => {

    console.log("url:",GlobalConfig.getFrontendURL()+'/api/signup');


    const data = (await axios.post(GlobalConfig.getFrontendURL()+'/api/signup', employee)).data;

    if(data.status === "ok"){
      return "OK";
    }

    else{
      return "ERROR"+data.msg;
    }

  }

}

export const humanResourceApi = new HumanResourceApi();
