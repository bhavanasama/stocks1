const mysql = require('mysql2/promise');
const {connectToDatabase} = require('../config/database');

class IndexController {
    constructor() {
        this.initDB();
    }
    async initDB() {
        this.db = await connectToDatabase();
        console.log('Database connection established successfully.');
    }
    async getItems(req,res){
        try {
            const [rows] = await this.db.query('SELECT * FROM stock_details');//modify this to your table name
            res.json(rows);
        } catch (error) {
            console.error('Error retrieving items:', error);
            res.status(500).json({error: 'Error retrieving items'});
        }
    }

    async getItemById(req, res) {
        const { id } = req.params;
        try {
          const [rows] = await this.db.query('SELECT * FROM stock_details WHERE user_id = ?', [id]);
          if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
          }
          res.json(rows[0]);
        } catch (err) {
          console.error('Error fetching item by ID:', err);
          res.status(500).json({ error: 'Failed to get item by ID' });
        }
      }
      
    async createItem(req, res) {
       const{user_id, username, stock_symbol, stock_company_name, transaction_type, quantity, price, transaction_date, sector} = req.body;  //modify this to your table columns
       console.log('Creating item:', {user_id, username, stock_symbol, stock_company_name, transaction_type, quantity, price, transaction_date, sector});
       try {
       // await this.db.query('INSERT INTO items (id, name, description) VALUES (?, ?, ?)', [id, name, description]); //modify this to your table name and columns
       await this.db.query(
        `INSERT INTO stock_details 
         (user_id, username, stock_symbol, stock_company_name, transaction_type, quantity, price, transaction_date, sector) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, username, stock_symbol, stock_company_name, transaction_type, quantity, price, transaction_date, sector]
      );
    }
       catch (error) {
           console.error('Error creating item:', error);
           return res.status(500).json({error: 'Internal Server Error'});
           
       }
       res.json({message: 'Item created successfully', item: {user_id, username, stock_symbol, stock_company_name, transaction_type, quantity, price, transaction_date, sector}});//modify this to your response structure
    }


  
    async buyStock(req, res) {
        const { user_id, stock_symbol, quantity } = req.body;
      
        if (!user_id || !stock_symbol || !quantity || quantity <= 0) {
          return res.status(400).json({ error: 'User ID, Stock Symbol, and Quantity are required and must be valid.' });
        }
      
        try {
          // Check if record exists
          const [rows] = await this.db.query(
            'SELECT * FROM stock_details WHERE user_id = ? AND stock_symbol = ?',
            [user_id, stock_symbol]
          );
      
          if (rows.length === 0) {
            return res.status(404).json({ error: 'No matching stock record found for this user.' });
          }
      
          const current = rows[0];
          const newQuantity = current.quantity + quantity;
      
          // Calculate new average price
          const newTotalValue = (current.quantity * current.price) + (quantity * current.price); // same price for simplicity
          const newAveragePrice = newTotalValue / newQuantity;
      
          await this.db.query(
            'UPDATE stock_details SET quantity = ?, price = ? WHERE user_id = ? AND stock_symbol = ?',
            [newQuantity, newAveragePrice, user_id, stock_symbol]
          );
      
          res.json({ message: `Bought ${quantity} more of ${stock_symbol}. Quantity updated to ${newQuantity}.` });
        } catch (err) {
          console.error('Buy error:', err);
          res.status(500).json({ error: 'Failed to process buy operation.' });
        }
      }

      async sellStock(req, res) {
        const { user_id, stock_symbol, quantity } = req.body;
      
        try {
          const [[item]] = await this.db.query(
            `SELECT * FROM stock_details WHERE user_id = ? AND stock_symbol = ?`,
            [user_id, stock_symbol]
          );
      
          if (!item) {
            return res.status(404).json({ error: 'Stock not found for user.' });
          }
      
          const currentQty = item.quantity;
          const currentTotal = item.price; // total value stored
      
          if (quantity > currentQty) {
            return res.status(400).json({ error: 'Quantity of stock is unavailable.' });
          } else if (quantity === currentQty) {
            // Delete row if quantity matches
            await this.db.query(`DELETE FROM stock_details WHERE user_id = ?`, [item.user_id]);
            return res.json({ message: 'All stocks sold. Entry removed.' });
          } else {
            const newQty = currentQty - quantity;
            const avgPrice = currentTotal / currentQty;
            const newTotal = newQty * avgPrice;
      
            await this.db.query(
              `UPDATE stock_details SET quantity = ?, price = ? WHERE user_id = ?`,
              [newQty, newTotal, item.user_id]
            );
      
            return res.json({ message: 'Stock sold successfully.' });
          }
        } catch (err) {
          console.error('Sell error:', err);
          res.status(500).json({ error: 'Sell operation failed.' });
        }
      }
      
      
  
   

   
     
  
      
    
    
    }


module.exports =  IndexController;