const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const hosting = process.env.DB_HOSTING;
const databaseName = "financial_calculator";

export default {
  "username": username,
	"password": password,
	"databaseName": databaseName,
	"hosting": hosting,
  "database": "mongodb://"+ username +":"+ password +"@"+ hosting +"/"+ databaseName,
  "port": process.env.PORT || 8123,
  "secretKey": "YourSecreKey"
}