import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom'
import { categories } from '../utils';

const App = () => {
  const [transactions, setTransactions] = useState({});
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState('');
  const [id, setId] = useState();
  const [show, setShow] = useState({ show: false, type: 'add' });
  const typeObj = {
    "": "",
    debit: 'Pengeluaran',
    credit: 'Pemasukan',
  }
  const [filterMonth, setFilterMonth] = useState(moment(new Date()).format('YYYY-MM'));
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const { category } = useParams();

  useEffect(() => {
    handleSearch()
  }, [size, page, filterMonth]);

  useEffect(() => {
    axios.get('/transactions/total', { params: { category } })
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
    const form = document.getElementById('transaction-form');
    if (!form.checkValidity()) {
      return form.classList.add('was-validated');
    }

    const method = show.type === 'add' ? 'post' : 'put';
    const body = { date, category, type, amount, description };
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
      page,
      category
    };
    const start = moment(filterMonth).startOf('month').format('YYYY-MM-DD');
    const end = moment(filterMonth).endOf('month').format('YYYY-MM-DD');
    params.date = `${start}|${end}`;
    axios.get('/transactions', { params })
      .then(res => {
        setTransactions(res.data);
      })
      .catch(error => console.log(error.response.data));
  };

  const currencyFormatter = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  });

  const Form = () => (
    <form id="transaction-form" className='needs-validation' noValidate>
      <div className='mb-3'>
        <label htmlFor="date" className="form-label">Tanggal Transaksi</label>
        <input className="form-control" id="date" name="date" type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Tanggal" required />
        <div className={date ? "valid-feedback" : "invalid-feedback"}>
          Silakan pilih tanggal transaksi!
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor="type" className="form-label">Pilih Jenis Transaksi</label>
        <select className='form-select' name="type" id="type" value={type} onChange={e => setType(e.target.value)} required>
          {Object.keys(typeObj).map(x => (
            <option key={x} value={x} disabled={x === ""}>{typeObj[x]}</option>
          ))}
        </select>
        <div className={type ? "valid-feedback" : "invalid-feedback"}>
          Silakan pilih jenis transaksi!
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor="amount" className="form-label">Jumlah Uang</label>
        <input id="amount" name="amount" className="form-control" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Jumlah" required />
        <div className={amount ? "valid-feedback" : "invalid-feedback"}>
          Silakan masukan jumlah uang!
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor="description" className="form-label">Deskripsi</label>
        <textarea id="description" name="description" className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi" required />
        <div className={description ? "valid-feedback" : "invalid-feedback"}>
          Beri deskripsi pada transaksi ini!
        </div>
      </div>
    </form>
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
      <div className='mb-3 col-10 col-lg-3 col-md-6'>
        <input
          className="form-control"
          id="filter-date-from"
          name="filter-date-from"
          type="month"
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
        />
      </div>
      {localStorage.getItem('token') && (
        <div className='col-2 col-md-6 col-lg-9'>
          <button type="button" onClick={() => setShow({ show: true, type: 'add' })} className='btn btn-danger float-end'>+<span className='d-none d-md-inline d-lg-inline'> Tambah Transaksi</span></button>
        </div>
      )}
    </div>
  )

  const handleDelete = (data) => {
    axios.delete(`/transactions/${data.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(handleSearch)
      .catch(error => console.log(error.response.data))
  }

  const handleEdit = ({ id, ...data }) => {
    setId(id)
    setDate(moment(data.date).format('YYYY-MM-DD'));
    setType(data.type);
    setAmount(Math.trunc(data.amount));
    setDescription(data.description);
    setShow({ show: true, type: 'edit' });
  }

  return (
    <>
      {ModalForm()}
      <div className='mx-3' data-aos="fade-right">
        <div className='row my-4'>
          <div className='align-content-center'><h3 className='text-capitalize'>{categories[category]}</h3></div>
        </div>
        <p className='col-10 col-md-6 col-lg-6'>Total Saldo Hingga {moment().format('MMMM')}: <strong>{currencyFormatter.format(total)}</strong></p>        
        <div>
          <div className='row my-2'>
            <FilterForm />
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
                  {localStorage.getItem('token') && <th scope='col'></th>}
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {transactions.data?.map((x,i) => (
                  <tr key={x.id}>
                    <th scope='row'>{(i + ((page - 1) * size)) + 1}</th>
                    <td>{moment(x.date).format('DD MMM YYYY')}</td>
                    <td>{typeObj[x.type]}</td>
                    <td>{currencyFormatter.format(x.amount)}</td>
                    <td>{x.description}</td>
                    {localStorage.getItem('token') && (
                      <td>
                        <div className='btn-group'>
                          <button type='button' className='btn btn-sm btn-primary' onClick={() => handleEdit(x)}><i className="bi bi-pencil"></i></button>
                          <button type='button' className='btn btn-sm btn-danger' onClick={() => handleDelete(x)}><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              <select className='me-2' name="size" id="size" value={size} onChange={e => setSize(e.target.value)}>
                {[...Array(5)].map((x, i) => (
                  <option key={i.toString()} value={(i+1) * 5}>{(i+1) * 5}</option>
                ))}
              </select>
              <li className={`page-item ${page === 1 ? 'disabled': ''}`}>
                <a className="page-link" onClick={() => setPage(page - 1)}>Previous</a>
              </li>
              {[...Array(transactions.totalPages)].map((x, i) => (
                <li key={i.toString()} className="page-item"><a className={`page-link ${(i+1) === page ? 'active': ''}`} onClick={() => setPage(i+1)}>{i+1}</a></li>
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