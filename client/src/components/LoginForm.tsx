import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [favoriteFilms, setFavoriteFilms] = useState<string>('');
  const { store } = useContext(Context);

  return (
    <div>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type='text'
        placeholder='Email'
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type='password'
        placeholder='Пароль'
      />

      <input
        onChange={(e) => setFavoriteFilms(e.target.value)}
        value={favoriteFilms}
        placeholder='избранные фильмы'
      />
      <button onClick={() => store.login(email, password)}>Логин</button>
      <button
        onClick={() => store.registration(email, password, favoriteFilms)}
      >
        Регистрация
      </button>
      <button
        onClick={() => store.registration(email, password, favoriteFilms)}
      >
        Регистрация
      </button>
    </div>
  );
};

export default observer(LoginForm);
