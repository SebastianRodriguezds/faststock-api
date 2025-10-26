const db = require('../src/db/postgres');


async function init() {
await db.query(`
CREATE TABLE IF NOT EXISTS products (
id SERIAL PRIMARY KEY,
name TEXT,
price NUMERIC(10,2),
stock INTEGER
);
`);


// Insertar algunos productos si la tabla está vacía
const res = await db.query('SELECT count(*)::int as c FROM products');
if (res.rows[0].c === 0) {
await db.query("INSERT INTO products (name, price, stock) VALUES ('Producto A', 9.99, 100),( 'Producto B', 19.99, 50),( 'Producto C', 5.00, 200)");
}
console.log('DB inicializada');
process.exit(0);
}


init().catch(err => { console.error(err); process.exit(1); });