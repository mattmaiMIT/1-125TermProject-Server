// 1.125 Term Project IoT Server.
// The tasks of this program: 
// 1) receiving the POST request and cache it in a RAM
// 2) data visualization for human interface
// 3) providing API for user to request the historical data 
// 4) storing it in a database, 

const express = require('express');                             //https://expressjs.com/en/starter/hello-world.html
const bodyparser = require('body-parser');                      //need npm install body-parser
const path = require('path');
const db = require(path.join(__dirname, 'dbfunctions.js'));     //need npm install mysql2

const jsonparser = bodyparser.json();
const app = express();                                        
const port = 3001;
const iot_data_cache = {};
const iot_timeout_id = {};

// change startOver to be true if want to drop the iot db and start all over.
const startOver = false;
if(startOver){
    db.resetDB();
} else {
    db.connectDB();
}

async function insertData(data){
  const dataQuery = db.generateInsertQuery(data);
  await db.executeQuery(dataQuery);
}

app.post('/api/collect', jsonparser, async function(req, res){
  console.log(req.body);
  iot_data_cache[req.body.device_id] = req.body;
  clearTimeout(iot_timeout_id[req.body.device_id]);
  iot_timeout_id[req.body.device_id] = setTimeout(()=>{
      delete iot_data_cache[req.body.device_id];
      delete iot_timeout_id[req.body.device_id];
  }, 2000);

  await insertData(req.body); 

  res.send('ok');
});

app.get('/', (req, res) => {
  res.render('index', {
    'device_ids': Object.keys(iot_data_cache)
  });
});

app.use(express.static('public'));

//npm install ejs, default folder name that stores all ejs files is "view"
app.set('view engine', 'ejs');

app.get('/monitor/:device_id', (req, res) => {
    if(!iot_data_cache[req.params.device_id]){
      iot_data_cache[req.params.device_id] = {
        'device_id': req.params.device_id,
        'output_power': 0.0,
        'power_factor': 0.0,
        'frequency': 0.0,
        'ts': 0
      }
    }
    res.render('monitor', {
      'device_id': req.params.device_id
    });
});

app.get('/api/data/:device_id', (req, res) => {
    var data = iot_data_cache[req.params.device_id];
    if(!data){
      data = {
        'device_id': req.params.device_id,
        'output_power': 0.0,
        'power_factor': 0.0,
        'frequency': 0.0,
        'ts': 0
      }
    }
    res.send(JSON.stringify(data));
});

app.get("/api/history/:device_id/:row_number", async function(req, res){
  // select the latest 100 data for machine API
  const [rows, fields] = await db.history(req.params.device_id, req.params.row_number);
  if (rows.length > 0) {
      rows.forEach(element => {
          element.ts_generated = element.ts_generated.getTime();
          element.ts_received = element.ts_received.getTime();
      });
  }
  res.send(JSON.stringify(rows));
});

app.get("/history/:device_id/:row_number", async function(req, res){
  // select the latest 100 data for human UI
  const [rows, fields] = await db.history(req.params.device_id, req.params.row_number);
  if (rows.length > 0) {
      res.render('history.ejs', {
          device_id: req.params.device_id,
          data: rows
      });
  } else {
      res.render('history.ejs', {
          device_id: req.params.device_id,
          data: undefined
      });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

