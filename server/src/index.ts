require('dotenv').config({path: __dirname + '/.env'});
import app from './app';

const port = process.env.PORT || 8321

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
