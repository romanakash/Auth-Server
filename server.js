import app from './app';

const port = process.env.NODE_ENV || 3000;

app.listen(port, () => {
	console.log('Listening on port ' + port);
});
