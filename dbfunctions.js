const mySQL = require('mysql2/promise');

const queryDropIoTDB = 'DROP DATABASE IF EXISTS `iot_db`'
const queryCreateDB = 'CREATE DATABASE IF NOT EXISTS `iot_db`';
const queryShowDB = 'SHOW DATABASES';
const queryUseIoTDB = 'USE `iot_db`';
const queryDropIoTTable = 'DROP TABLE IF EXISTS `iot_data`';
const queryCreateTable = 'CREATE TABLE IF NOT EXISTS `iot_data` ( \
  `id` int AUTO_INCREMENT, \
  `device_id` varchar(16) NOT NULL, \
  `output_power` FLOAT, \
  `power_factor` FLOAT, \
  `frequency` FLOAT, \
  `ts_generated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
  `ts_received` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
  PRIMARY KEY (id) \
)';
const queryDescribeTable = 'DESCRIBE `iot_data`';
const querySelectAllIoTData = 'SELECT * FROM `iot_data`'
const SHOW_RESULTS = true;

var db = {};

db.connectDB = async function(){
    db.connection = await mySQL.createConnection({
        host: 'dbaas-db-65009-do-user-9878422-0.b.db.ondigitalocean.com',
        user: 'doadmin',
        password: '2NSLAy2WjgVfSKjM',
        database: 'defaultdb',
        port: 25060
    });
    db.executeQuery(queryUseIoTDB, SHOW_RESULTS);
    console.log("DB connected");
};

db.executeQuery = async function( query, showLog = false){
    // https://www.npmjs.com/package/mysql2#first-query (Using Prepared Statements)
    if (!db.connection) {
      console.error('No connection');
      return;
    }
    const [rows, fields] = await db.connection.query(query);
    if (showLog){
      if (rows) {console.log(rows);}
    }
    return [rows, fields];
  }  

db.generateInsertQuery = function(received_iot_data){
    // https://riptutorial.com/mysql/example/25536/store-a-javascript-timestamp-into-a-timestamp-column
    const deviceID_valueStr = "'" + received_iot_data.device_id + "'";
    return "INSERT INTO `iot_data` (`device_id`, `output_power`, `power_factor`, `frequency`, `ts_generated`)"
    + "VALUES "
    + "("+ deviceID_valueStr + ", " 
    + received_iot_data.output_power + ", " 
    + received_iot_data.power_factor + ", " 
    + received_iot_data.frequency + ", " 
    + "FROM_UNIXTIME(" + received_iot_data.ts + " * 0.001 )"
    +")"
}  

db.resetDB = async function() {
    await db.connectDB();
    await db.executeQuery(queryDropIoTDB);
    await db.executeQuery(queryCreateDB);
    await db.executeQuery(queryShowDB, SHOW_RESULTS);
    await db.executeQuery(queryUseIoTDB);
    await db.executeQuery(queryDropIoTTable);
    await db.executeQuery(queryCreateTable);
    await db.executeQuery(queryDescribeTable, SHOW_RESULTS);
    
    const dataQuery = db.generateInsertQuery(
      {
        id: "TestDev01",
        output_power: 250,
        power_factor: 99,
        frequency: 60,
        ts: Date.now()
      }
    )
    setTimeout(async function(){
      await db.executeQuery(dataQuery);
      const [rows, fields] = await db.executeQuery(querySelectAllIoTData);
      if (rows) {
        console.log(rows);
        console.log(rows[0].ts_generated.getTime());
      }
    }, 3000);
  }
  
  db.history = async function(device_id, rowNumber){
    const query = `SELECT * FROM iot_data WHERE device_id = '${device_id}' ORDER BY id DESC LIMIT ${rowNumber}`
    const [rows, fields] = await db.executeQuery(query);
    return [rows, fields];
  }
  
  module.exports = db;


