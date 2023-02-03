import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import './Forms.css'

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory()

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      console.log("does it come in here?", data)
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const demoUser = async (e) => {
    e.preventDefault();
    // setEmail('demo@aa.io')
    // setPassword('password')
    let demoEmail = 'demo@aa.io'
    let demoPw = 'password'
    const demo = await dispatch(login(demoEmail, demoPw))
    // if (demo) {
    //   setErrors(demo);
    // }
    history.push('/')
  }

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login-sign-wrapper'>
      <div className='login-sign-backdrop'>
        <div className='card-container'>
          <div className='login-sign-card'>
            <h2>slacker</h2>
            <h4>Welcome Back</h4>
            <form className='login-sign-form' onSubmit={onLogin}>
              <div>
                {errors.map((error, ind) => (
                  <div key={ind}>
                    {error}
                  </div>
                ))}
              </div>
              <div>
                {/* <label htmlFor='email'>Email</label> */}
                <input
                  className='login-sign-input'
                  name='email'
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={updateEmail}
                />
              </div>
              <div>
                {/* <label htmlFor='password'>Password</label> */}
                <input
                  className='login-sign-input'
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={updatePassword}
                />
              </div>
              <div className='login-sign-button'>
                <button className='single-login'
                  type='submit'>Login</button>
                <button className='single-login' onClick={demoUser}>Demo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
