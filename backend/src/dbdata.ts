import sqlite3 from "sqlite3";

// create a database if not exist
let db = new sqlite3.Database('./guoping.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
          console.log("logging here ");
          console.error(err.message);
      }
      console.log('Connected to the guoping database.');
});

const create_table = async () => {
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        email VARCHAR(255)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS work_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        status VARCHAR(255) CHECK( status IN ('OPEN', 'CLOSED') ) NOT NULL DEFAULT 'OPEN'
      );
    `);

    await db.run(`
    CREATE TABLE IF NOT EXISTS work_order_assignees (
      work_order_id INT NOT NULL,
      user_id INT NOT NULL,
      PRIMARY KEY(work_order_id, user_id),
      FOREIGN KEY(work_order_id) REFERENCES work_orders(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    `);
  };

  // init database
const init_data = async () => { 
    await db.run(`
        INSERT OR IGNORE INTO users(id, name, email)
        VALUES
          (1, 'James Dubois', '8976@hotmail.com'),
          (2, 'Guoping Dubois', 'b123@gmail.com'),
          (3, 'Aliana Dubois', 'a45@aws.com'),
          (4, 'Cat Dubois', 'dawg@yahoo.com'),
          (5, 'Donalt Trump', '111@hotmail.com'),
          (6, 'Joe Biden', '222@mail.com'),
          (7, 'Genius Biden', '333@gmail.com'),
          (8, 'George Bush', '444@yahoo.com'),
          (9, 'Pickle Bush', '555@hotmail.com');
      `);

    await db.run (`
      INSERT OR IGNORE INTO work_orders (id, name, status)
      VALUES
        (1, 'cleaning chemistry lab', 'OPEN'),
        (2, 'cleaning economy class room', 'OPEN'),
        (3, 'fix physics equipments', 'OPEN'),
        (4, 'buy politics notebooks', 'OPEN'),
        (5, 'organize finance books', 'CLOSED'),
        (6, 'do mathematics homeworks', 'CLOSED'),
        (7, 'do arts', 'OPEN'),
        (8, 'fix geology classrooms', 'OPEN'),
        (9, 'write literature homeworks', 'CLOSED');
    `); 

    await db.run(`
      INSERT OR IGNORE INTO work_order_assignees (work_order_id, user_id)
      VALUES
        (3, 1),
        (3, 5),
        (3, 6),
        (5, 1),
        (2, 3),
        (3, 4),
        (6, 5),
        (1, 2),
        (1, 3),
        (1, 9),
        (1, 5),
        (1, 4),
        (4, 8);
    `); 
};

  
( () => {
        create_table (); 
        setTimeout( 
            ()=>{init_data(); console.log("table and data initialized")
        }, 500); 

        setTimeout( () => db.close((err) => {
            if (err) {
                console.log (err.message);
                return;
            }
            console.log('database file guoping.db created.');
            }), 1000); 
        }
) ();