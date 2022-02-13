import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { IUser } from '../models/IUser';

export default class UserService {
  static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/users');
  }
  static fetchUser(): any {
    return $api.get<any>('/user');
  }
  static async postUser(user: IUser): Promise<AxiosResponse<IUser>> {
    return $api.post<IUser>('/user', { user });
  }
}
