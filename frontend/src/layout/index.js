import React, { useState, useContext } from 'react';
import { logoBlackNoBgSvg, logoWhiteNoBgSvg } from '../assets/images';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { categories, getUserInfoFromToken } from '../utils';
import { AppContext } from '../navigation';
import { showToast } from '../components/toast';

const NavBar = ({ color }) => {
  const [showForm, setShowForm] = useState('');
  const [formType, setFormType] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loggedIn, setLoggedIn, setIsAdmin } = useContext(AppContext);

  const ModalForm = () => (
    <Modal
      show={showForm}
      onHide={() => {
        setShowForm(false);
        setFormType('');
        setName('');
        setUsername('');
        setPassword('');
        setRetypePassword('');
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className='text-capitalize'>{formType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="login-form" className='needs-validation' noValidate>
          {formType === 'register' && (
            <div className='mb-3 input-group'>
              <span className="input-group-text"><i className="bi bi-person" /></span>
              <input id="name" name="name" className="form-control" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
              <div className={name ? "valid-feedback" : "invalid-feedback"}>
                Masukan nama lengkap!
              </div>
            </div>
          )}
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
          {formType === 'register' && (
            <div className='mb-3 input-group'>
              <span className="input-group-text" id="basic-addon1" onClick={() => setShowPassword(!showPassword)}><i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} /></span>
              <input type={showPassword ? "text" : "password"} id="retype-password" name="retype-password" className="form-control" value={retypePassword} onChange={e => setRetypePassword(e.target.value)} placeholder="Retype Password" required />
              <div className={retypePassword ? "valid-feedback" : "invalid-feedback"}>
                Masukan ulang password!
              </div>
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button className='text-capitalize' variant="primary" onClick={formType === 'register' ? handleRegister : handleLogin}>
          {formType}
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
        setShowForm(false);
        setFormType('');
        setUsername('');
        setPassword('');
        setLoggedIn(true);
        setIsAdmin(getUserInfoFromToken('role', res.data.token) === 'admin');
        showToast('success', 'Berhasil Login!');
      })
      .catch(error => {
        showToast('error', JSON.stringify(error.response.data))
      });
  }

  const handleRegister = () => {
    const form = document.getElementById('login-form');
    if (!form.checkValidity()) {
      return form.classList.add('was-validated');
    }
    if (password !== retypePassword) {
      return showToast('error', 'Password tidak sama!');
    }
    axios.post('/auth/register', { name, username, password, retypePassword })
      .then(() => {
        setShowForm(false);
        setFormType('');
        setName('');
        setUsername('');
        setPassword('');
        setRetypePassword('');
        showToast('success', 'Berhasil Register!');
      })
      .catch(error => {
        showToast('error', JSON.stringify(error.response.data))
      });
  }

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setIsAdmin(false);
    showToast('success', 'Berhasil Logout!');
  }

  return (
    <>
      {ModalForm()}
      <nav className={`main-header darbuka-toggler navbar-${color === 'dark' ? 'light' : 'dark'} navbar navbar-expand-sm shadow-sm`} data-aos="fade-right">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={color === 'dark' ? logoBlackNoBgSvg : logoWhiteNoBgSvg} height={50} width={150} />
          </a>
          <button className="custom-toggler navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {Object.keys(categories).map(x => (
                <li className="nav-item" key={x}>
                  <a className={`${color === 'dark' ? 'text-black' : 'text-white'} fw-semibold nav-link active text-capitalize`} aria-current="page" href={`/transaction/${x}`}>{categories[x]}</a>
                </li>
              ))}
            </ul>
            <form className="d-flex gap-2" role="search">
              <button
                type="button"
                className={`btn btn-outline-${color} btn-darbuka-login`}
                onClick={() => {
                  if (loggedIn) return handleLogout();
                  setFormType('login');
                  return setShowForm(true);
                }}
              >
                {loggedIn ? 'Logout' : 'Login'}
              </button>
              {!loggedIn && (
                <button
                  type="button"
                  className={`btn btn-outline-${color} btn-darbuka-login`}
                  onClick={() => {
                    setFormType('register');
                    return setShowForm(true);
                  }}
                >
                  Register
                </button>
              )}
            </form>
          </div>
        </div>
      </nav>
    </>
  )
}

const Footer = ({ color }) => {
  return (
    <nav className="main-footer">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <span className={`${color === 'dark' ? 'text-black' : 'text-white'} fw-semibold`}>
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
