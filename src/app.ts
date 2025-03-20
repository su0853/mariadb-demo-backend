import express from 'express'
import {router} from "./Routers"
import { logger } from './middlewares/log';
const http = require('http');
import cors from 'cors';
import { Mariadb } from './utils/Mariadb';
require('dotenv').config()
const app: express.Application = express()
const server = http.createServer(app);

export const DB = new Mariadb();

app.use(cors({
  // "origin": "https://sec.ethci.app",
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200,
  "exposedHeaders": ['Content-Disposition']
}))

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: false }))
app.use('/assets', express.static(process.env.assetsPath as string));

for (const route of router) {
  app.use(route.getRouter())
}
//
// **新增: 測試資料庫連線**
async function testDatabaseConnection() {
  try {
    await DB.testConnection(); // 呼叫 Mariadb.ts 中的 testConnection()
    logger.info('✅ 成功連接至資料庫！');
  } catch (error) {
    logger.error('❌ 資料庫連接失敗:', error);
  }
}

// 啟動伺服器，並測試資料庫連線
server.listen(process.env.SVPORT, async () => {
  logger.info('✅ 伺服器啟動於 Port:' + process.env.SVPORT);
  await testDatabaseConnection(); // 測試資料庫連線
});
//server.listen(process.env.SVPORT, () => {
  //logger.info('listening on *:'+process.env.SVPORT);
//});


