import * as express from 'express';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

import RestRouter from './routes';
import Config from './config';

mongoose.connect(Config.database);

class App {
  public express;

  constructor () {
    const router = express.Router();
    this.express = express();
    this.express.use(logger('dev'));
    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());

    this.express.enable('trust proxy');
    this.express.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      next();
    });

    this.express.use('/rest', RestRouter());

    // catch 404 and forward to error handler
    this.express.use((req, res, next) => {
      var err = new Error('Not Found');
      next(err);
    });

    // error handler
    this.express.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      console.error(err);
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }
}

export default new App().express;
