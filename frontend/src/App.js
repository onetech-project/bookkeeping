import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [transactions, setTransactions] = useState({});
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState('');
  const [id, setId] = useState();
  const [show, setShow] = useState({ show: false, type: 'add' });
  const [showLogin, setShowLogin] = useState('');
  const typeObj = {
    "": "",
    debit: 'Pengeluaran',
    credit: 'Pemasukan',
  }
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterType, setFilterType] = useState('');
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    handleSearch()
  }, [size, page]);

  useEffect(() => {
    axios.get('/transactions/total')
      .then(res => {
        setTotal(res.data.total);
      })
      .catch(error => console.log(error.response.data));
  }, [transactions])

  const resetForm = () => {
    setId('');
    setDate('');
    setType('');
    setAmount();
    setDescription('');
  }

  const handleSubmit = () => {
    const method = show.type === 'add' ? 'post' : 'put';
    const body = { date, type, amount, description };
    const options = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    const url = show.type === 'add' ? '/transactions' : `/transactions/${id}`;
    axios[method](url, body, options)
      .then(() => {
        handleSearch();
        resetForm();
        setShow({ show: false });
      })
      .catch(error => {
        if (error.response.status === 403) {
          localStorage.removeItem('token');
        }
        console.log(error.response.data);
      });
  };

  const handleSearch = () => {
    const params = {
      size,
      page
    };
    if (filterDateFrom && filterDateTo) params.date = `${filterDateFrom}|${filterDateTo}`;
    if (filterType) params.type = filterType;
    axios.get('/transactions', { params })
      .then(res => {
        setTransactions(res.data);
      })
      .catch(error => console.log(error.response.data));
  };

  const handleReset = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterType('')
  }

  const currencyFormatter = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  });

  const Form = () => (
    <div>
      <div className='mb-3'>
        <label htmlFor="date" className="form-label">Tanggal Transaksi</label>
        <input className="form-control" id="date" name="date" type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Tanggal" />
      </div>
      <div className='mb-3'>
        <label htmlFor="type" className="form-label">Pilih Jenis Transaksi</label>
        <select defaultValue={""} className='form-select' name="type" id="type" value={type} onChange={e => setType(e.target.value)}>
          {Object.keys(typeObj).map(x => (
            <option value={x} disabled={x === ""}>{typeObj[x]}</option>
          ))}
        </select>
      </div>
      <div className='mb-3'>
        <label htmlFor="amount" className="form-label">Jumlah Uang</label>
        <input id="amount" name="amount" className="form-control" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Jumlah" />
      </div>
      <div className='mb-3'>
        <label htmlFor="description" className="form-label">Deskripsi</label>
        <textarea id="description" name="description" className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi" />
      </div>
    </div>
  )
  
  const ModalForm = () => (
    <Modal 
      show={show.show} 
      onHide={() => {
        setShow({ show: false });
        resetForm();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{show.type === 'add' ? 'Tambah' : 'Ubah'} Transaksi</Modal.Title>
      </Modal.Header>
      <Modal.Body>{Form()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow({ show: false })}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Kirim
        </Button>
      </Modal.Footer>
    </Modal>
  )

  const FilterForm = () => (
    <div className='row'>
      <div className='mb-3 col-12 col-lg-3 col-md-6'>
        <label htmlFor="filter-date-from" className="form-label">Dari Tanggal</label>
        <input className="form-control" id="filter-date-from" name="filter-date-from" type="date" value={filterDateFrom} max={filterDateTo} onChange={e => setFilterDateFrom(e.target.value)} placeholder="Dari Tanggal" />
      </div>
      <div className='mb-3 col-12 col-lg-3 col-md-6'>
        <label htmlFor="filter-date-to" className="form-label">Sampai Tanggal</label>
        <input className="form-control" id="filter-date-to" name="filter-date-to" type="date" value={filterDateTo} min={filterDateFrom} onChange={e => setFilterDateTo(e.target.value)} placeholder="Sampai Tanggal" />
      </div>
      <div className='mb-3 col-12 col-lg-3 col-md-6'>
        <label htmlFor="filter-type" className="form-label">Pilih Jenis Transaksi</label>
        <select defaultValue={""} className='form-select' name="filter-type" id="filter-type" value={filterType} onChange={e => setFilterType(e.target.value)}>
          {Object.keys(typeObj).map(x => (
            <option value={x} disabled={x === ""}>{typeObj[x]}</option>
          ))}
        </select>
      </div>
      <div className='col-12 col-lg-3 col-md-6 d-flex flex-row align-content-center justify-content-start flex-wrap gap-2'>
        <button type='button' className='btn btn-primary' onClick={handleSearch} placeholder='search'><i class="bi bi-search"></i> Cari</button>
        <button type='button' className='btn btn-secondary' onClick={handleReset} placeholder='search'>Reset</button>
      </div>
    </div>
  )

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
        <div>
          <div className='mb-3'>
            <label htmlFor="username" className="form-label">Username</label>
            <input id="username" name="username" className="form-control" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div className='mb-3'>
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" name="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  )

  const handleLogin = () => {
    axios.post('/auth/login', { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setShowLogin(false);
        setUsername('');
        setPassword('');
      })
      .catch(error => console.log(error.response.data));
  }

  const handleDelete = (data) => {
    axios.delete(`/transactions/${data.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(handleSearch)
      .catch(error => console.log(error.response.data))
  }

  const handleEdit = ({ id, ...data }) => {
    setId(id)
    setDate(moment(data.date).format('YYYY-MM-DD'));
    setType(data.type);
    setAmount(data.amount);
    setDescription(data.description);
    setShow({ show: true, type: 'edit' });
  }

  return (
    <>
      {ModalForm()}
      {ModalLogin()}
      <div className='container'>
        <div className='row my-2'>
          <div className='col-6 align-content-center'><h1 className='col-6'>DARBUKA</h1></div>
          {!localStorage.getItem('token') && (
            <div className='col-6 align-content-center'>
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className='btn btn-danger float-end'
              >
                Login
              </button>
            </div>
          )}
        </div>
        <FilterForm />
        <div>
          <div className='row my-2'>
            <p className='col-10 col-md-6 col-lg-6'>total dana: <strong>{currencyFormatter.format(total)}</strong></p>
            {localStorage.getItem('token') && (
              <div className='col-2 col-md-6 col-lg-6'>
                <button type="button" onClick={() => setShow({ show: true, type: 'add' })} className='btn btn-danger float-end'>+<span className='d-none d-md-inline d-lg-inline'> Tambah Transaksi</span></button>
              </div>
            )}
          </div>
          <div className='table-responsive'>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>Tanggal</th>
                  <th scope='col'>Tipe</th>
                  <th scope='col'>Jumlah</th>
                  <th scope='col'>Deskripsi</th>
                  <th scope='col'></th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                {transactions.data?.map((x,i) => (
                  <tr key={x.id}>
                    <th scope='row'>{(i + ((page - 1) * size)) + 1}</th>
                    <td>{moment(x.date).format('DD MMM YYYY')}</td>
                    <td>{typeObj[x.type]}</td>
                    <td>{currencyFormatter.format(x.amount)}</td>
                    <td>{x.description}</td>
                    <td>
                      <div className='btn-group'>
                        <button type='button' className='btn btn-sm btn-primary' onClick={() => handleEdit(x)}><i class="bi bi-pencil"></i></button>
                        <button type='button' className='btn btn-sm btn-danger' onClick={() => handleDelete(x)}><i class="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              <select defaultValue={""} className='me-2' name="size" id="size" value={size} onChange={e => setSize(e.target.value)}>
                {[...Array(5)].map((x, i) => (
                  <option value={(i+1) * 5}>{(i+1) * 5}</option>
                ))}
              </select>
              <li className={`page-item ${page === 1 ? 'disabled': ''}`}>
                <a className="page-link" onClick={() => setPage(page - 1)}>Previous</a>
              </li>
              {[...Array(transactions.totalPages)].map((x, i) => (
                <li className="page-item"><a className={`page-link ${(i+1) === page ? 'active': ''}`} onClick={() => setPage(i+1)}>{i+1}</a></li>
              ))}
              <li className={`page-item ${page === transactions.totalPages ? 'disabled': ''}`}>
                <a className="page-link" onClick={() => setPage(page + 1)}>Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default App;