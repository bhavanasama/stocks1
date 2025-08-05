document.addEventListener('submit', async function (e) {
    if (e.target.id === 'transactionForm') {
      e.preventDefault();
  
      const quantity = parseInt(document.getElementById('quantity').value);
      const price = parseFloat(document.getElementById('price').value);
      const total_value = quantity * price;
  
      const payload = {
        user_id: parseInt(document.getElementById('user_id').value),
        username: document.getElementById('username').value,
        stock_symbol: document.getElementById('stock_symbol').value,
        stock_company_name: document.getElementById('stock_company_name').value,
        transaction_type: document.getElementById('transaction_type').value,
        quantity,
        price,
        transaction_date: document.getElementById('transaction_date').value,
        total_value,
        sector: document.getElementById('sector').value
      };
  
      try {
        const response = await fetch('http://localhost:4040/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        const result = await response.json();
        const msg = document.getElementById('resultMessage');
  
        if (response.ok) {
          msg.textContent = result.message || 'Transaction added!';
          msg.className = 'text-success';
          e.target.reset();
        } else {
          msg.textContent = result.error || 'Failed.';
          msg.className = 'text-danger';
        }
      } catch (err) {
        console.error('POST failed:', err);
        document.getElementById('resultMessage').textContent = 'Server error.';
      }
    }
  });
  
  function clearForm() {
    document.getElementById('transactionForm').reset();
  }
  
  function fillRandom() {
    document.getElementById('user_id').value = Math.floor(Math.random() * 1000);
    document.getElementById('username').value = "user_" + Math.floor(Math.random() * 100);
    document.getElementById('stock_symbol').value = "ST" + Math.floor(Math.random() * 999);
    document.getElementById('stock_company_name').value = "Company " + Math.floor(Math.random() * 10);
    document.getElementById('transaction_type').value = ["BUY", "SELL"][Math.floor(Math.random() * 2)];
    document.getElementById('quantity').value = Math.floor(Math.random() * 100);
    document.getElementById('price').value = (Math.random() * 500).toFixed(2);
    document.getElementById('transaction_date').value = new Date().toISOString().split('T')[0];
    document.getElementById('sector').value = "Tech";
  }
  
  async function fetchTransactions() {
    try {
      const res = await fetch('http://localhost:4040/api/items');
      const data = await res.json();
      const tbody = document.getElementById('transactionTableBody');
      tbody.innerHTML = '';
  
      data.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${tx.user_id}</td><td>${tx.username}</td><td>${tx.stock_symbol}</td>
          <td>${tx.stock_company_name}</td><td>${tx.transaction_type}</td><td>${tx.quantity}</td>
          <td>${tx.price}</td><td>${tx.transaction_date}</td><td>${tx.total_value}</td><td>${tx.sector}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="updateTransaction(${tx.id})">Update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${tx.id})">Delete</button>
          </td>`;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
      alert('Error fetching data');
    }
  }
  
  async function deleteTransaction(id) {
    try {
      await fetch(`http://localhost:4040/api/items/${id}`, { method: 'DELETE' });
      fetchTransactions();
    } catch (err) {
      alert('Delete failed');
    }
  }
  
  function updateTransaction(id) {
    alert('To implement: fetch by ID, fill form, change to PUT on submit');
  }
  