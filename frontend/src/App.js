import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const typeObj = {
    debit: 'Pengeluaran',
    credit: 'Pemasukan',
  }

  useEffect(() => {
    axios.get('/transactions')
      .then(res => {
        setTransactions(res.data);
      })
      .catch(error => alert(JSON.stringify(error.response.data)));
    axios.get('/transactions/total')
      .then(res => {
        setTotal(res.data.total);
      })
      .catch(error => alert(JSON.stringify(error.response.data)));
  }, []);

  const handleSubmit = () => {
    axios.post('/transactions', { date, type, amount, description }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setTransactions([...transactions, res.data]);
        setDate('');
        setAmount(0);
        setDescription(0);
        setType('');
      })
      .catch(error => alert(JSON.stringify(error.response.data)));
  };

  const currencyFormatter = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  });

  return (
    <div>
      <h1>Pembukuan</h1>
      {localStorage.getItem('token') && (
        <>
          <div>
            <label for="date">Tanggal Transaksi</label>
            <input id="date" name="date" type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Tanggal" />
          </div>
          <div>
            <label for="type">Pilih Jenis Transaksi</label>
            <select name="type" id="type" value={type} onChange={e => setType(e.target.value)}>
              <option value="" disabled></option>
              <option value="credit">Pemasukan</option>
              <option value="debit">Pengeluaran</option>
            </select>
          </div>
          <div>
            <label for="type">Jumlah Uang</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Jumlah" />
          </div>
          <div>
            <label for="type">Deskripsi</label>
            <input type="textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi" />
          </div>
          <div>
            <button onClick={handleSubmit}>Tambah Transaksi</button>
          </div>
        </>
      )}
      <div>
        <p>total dana: <strong>{currencyFormatter.format(total)}</strong></p>
        <table border={1}>
          <tr>
            <th>no</th>
            <th>tanggal</th>
            <th>tipe</th>
            <th>jumlah</th>
            <th>deskripsi</th>
          </tr>
          {transactions.map((x,i) => (
            <tr key={x.id}>
              <td>{i + 1}</td>
              <td>{moment(x.date).format('DD MMM YYYY')}</td>
              <td>{typeObj[x.type]}</td>
              <td>{currencyFormatter.format(x.amount)}</td>
              <td>{x.description}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default App;