import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import './Forms.css'

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data)
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login-sign-wrapper'>
      <div className='login-sign-backdrop'>
        <div className='card-container'>
          <div className='login-sign-card'>
            <h2>slacker</h2>
            <h4>Create an account</h4>
            <form className='login-sign-form' onSubmit={onSignUp}>
              <div>
                {errors.map((error, ind) => (
                  <div key={ind}>{error}</div>
                ))}
              </div>
              <div>
                <input
                  className='login-sign-input'
                  type='text'
                  name='username'
                  onChange={updateUsername}
                  value={username}
                  placeholder='Username'
                  required={true}
                ></input>
              </div>
              <div>
                <input
                  className='login-sign-input'
                  type='email'
                  name='email'
                  onChange={updateEmail}
                  value={email}
                  placeholder='Email'
                  required={true}
                  email={true}
                ></input>
              </div>
              <div>
                <input
                  className='login-sign-input'
                  type='password'
                  minlength="8"
                  name='password'
                  onChange={updatePassword}
                  value={password}
                  placeholder='Password'
                  required={true}
                ></input>
              </div>
              <div>
                <input
                  className='login-sign-input'
                  type='password'
                  name='repeat_password'
                  onChange={updateRepeatPassword}
                  value={repeatPassword}
                  required={true}
                  placeholder='Repeat Password'
                ></input>
              </div>
              <div className='login-sign-button'>
                <button
                  className='single-login'
                  type='submit'>Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
