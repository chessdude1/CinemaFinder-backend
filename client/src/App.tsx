import React, { FC, useContext, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function getUser() {
    try {
      const response = await UserService.fetchUser();
      setUser(response.data);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  }

  async function postNewUser() {
    try {
      console.log(user);
      if (user) {
        let newUser = {
          ...user,
          _id: 1234,
        };
        const response = await UserService.postUser(newUser);
        console.log(response);
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
    );
  }

  return (
    <div>
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : 'АВТОРИЗУЙТЕСЬ'}
      </h1>
      <h1>
        {store.user.isActivated
          ? 'Аккаунт подтвержден по почте'
          : 'ПОДТВЕРДИТЕ АККАУНТ!!!!'}
      </h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={postNewUser}>Отправить пользователя</button>
        <button onClick={getUsers}>Получить пользователей</button>
        <button onClick={getUser}>Получить пользователя</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
};

export default observer(App);
