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
  const [show, setShow] = useState('');
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

  useEffect(() => {
    handleSearch()
  }, [size, page]);

  useEffect(() => {
    axios.get('/transactions/total')
      .then(res => {
        setTotal(res.data.total);
      })
      .catch(error => alert(JSON.stringify(error.response.data)));
  }, [transactions])

  const handleSubmit = () => {
    axios.post('/transactions', { date, type, amount, description }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        handleSearch();
        setDate('');
        setAmount(0);
        setDescription(0);
        setType('');
        setShow(false);
      })
      .catch(error => alert(JSON.stringify(error.response.data)));
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
      .catch(error => alert(JSON.stringify(error.response.data)));
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
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Transaksi</Modal.Title>
      </Modal.Header>
      <Modal.Body>{Form()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
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
        <input className="form-control" id="filter-date-from" name="filter-date-from" type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} placeholder="Dari Tanggal" />
      </div>
      <div className='mb-3 col-12 col-lg-3 col-md-6'>
        <label htmlFor="filter-date-to" className="form-label">Sampai Tanggal</label>
        <input className="form-control" id="filter-date-to" name="filter-date-to" type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} placeholder="Sampai Tanggal" />
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
        <button type='button' className='btn btn-primary' onClick={handleSearch} placeholder='search'>Cari</button>
        <button type='button' className='btn btn-secondary' onClick={handleReset} placeholder='search'>Reset</button>
      </div>
    </div>
  )

  return (
    <>
      {ModalForm()}
      <div className='container'>
        <h1>Pembukuan</h1>
        <FilterForm />
        <div>
          <div className='row my-2'>
            <p className='col-10 col-md-6 col-lg-6'>total dana: <strong>{currencyFormatter.format(total)}</strong></p>
            {localStorage.getItem('token') && (
              <div className='col-2 col-md-6 col-lg-6'>
                <button type="button" onClick={() => setShow(true)} className='btn btn-danger float-end'>+<span className='d-none d-md-inline d-lg-inline'> Tambah Transaksi</span></button>
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