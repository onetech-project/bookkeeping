import React, { useState, useContext } from 'react';
import { logoColorNoBgSvg } from '../assets/images';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { categories } from '../utils';
import { LoggedInContext } from '../navigation';
import { showToast } from '../components/toast';

const NavBar = () => {
  const [showLogin, setShowLogin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);

  const ModalLogin = () => (
    <Modal 
      show={showLogin} 
      onHide={() => {
        setShowLogin(false);
        setUsername('');
        setPassword('');
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="login-form" className='needs-validation' noValidate>
          <div className='mb-3 input-group'>
            <span className="input-group-text"><i className="bi bi-person" /></span>
            <input id="username" name="username" className="form-control" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
            <div className={username ? "valid-feedback" : "invalid-feedback"}>
              Masukan username!
            </div>
          </div>
          <div className='mb-3 input-group'>
            <span className="input-group-text" id="basic-addon1" onClick={() => setShowPassword(!showPassword)}><i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} /></span>
            <input type={showPassword ? "text" : "password"} id="password" name="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <div className={password ? "valid-feedback" : "invalid-feedback"}>
              Masukan password!
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  )

  const handleLogin = () => {
    const form = document.getElementById('login-form');
    if (!form.checkValidity()) {
      return form.classList.add('was-validated');
    }
    axios.post('/auth/login', { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setShowLogin(false);
        setUsername('');
        setPassword('');
        setLoggedIn(true);
        showToast('success', 'Berhasil Login!');
      })
      .catch(error => {
        console.log(error.response.data);
        showToast('error', JSON.stringify(error.response.data))
      });
  }

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    showToast('success', 'Berhasil Logout!');
  }

  return (
    <>
      {ModalLogin()}
      <nav className="navbar navbar-light navbar-expand-lg bg-body-darbuka-secondary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={logoColorNoBgSvg} height={50} width={150} />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {Object.keys(categories).map(x => (
                <li className="nav-item" key={x}>
                  <a className="text-primary nav-link active text-capitalize" aria-current="page" href={`/transaction/${x}`}>{categories[x]}</a>
                </li>
              ))}
            </ul>
            <form className="d-flex" role="search">
              <button
                type="button"
                className={`btn btn-outline-primary`}
                onClick={() => {
                  if (loggedIn) return handleLogout();
                  return setShowLogin(true);
                }}
              >
                {loggedIn ? 'Logout' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  )
}

const Footer = () => {
  return (
    <nav className="main-footer bg-body-darbuka-secondary">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <span className='text-primary'>
          <br />© {new Date().getFullYear()} All Right Reserved.&nbsp;
          <a className="text-reset text-decoration-none" href="/">
            Darbuka
          </a>
        </span>
      </div>
    </nav>
  )
}

export { NavBar, Footer };
