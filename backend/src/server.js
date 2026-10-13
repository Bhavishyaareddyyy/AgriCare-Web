import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { connectDatabase } from './db.js';

const app = express();
app.disable('x-powered-by');

const allowedOrigins = new Set([
	'http://localhost:5173',
	'http://localhost:5174',
	...(process.env.FRONTEND_ORIGIN || '').split(',').map(value => value.trim()).filter(Boolean)
]);

app.use(cors({ origin(origin, callback) { callback(null, !origin || allowedOrigins.has(origin)); } }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 90, standardHeaders: 'draft-7', legacyHeaders: false }), routes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
const server = app.listen(port);

try {
	await new Promise((resolve, reject) => {
		server.once('listening', resolve);
		server.once('error', reject);
	});
} catch (error) {
	if (error?.code === 'EADDRINUSE') {
		console.error(`AgriCare API could not start: port ${port} is already in use (EADDRINUSE).`);
		console.error(`Check the listener with: Get-NetTCPConnection -State Listen -LocalPort ${port} | Select-Object LocalAddress,OwningProcess`);
		console.error('If the listener is another AgriCare backend, stop it from its own terminal with Ctrl+C. Do not stop unrelated Node.js processes.');
		process.exitCode = 1;
	} else {
		throw error;
	}
}

if (server.listening) {
	await connectDatabase();
	console.log(`AgriCare API listening on ${port}`);
}

export default app;
