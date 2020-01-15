import request from 'supertest';

import app from '../../app';
import { usersDB } from '../db';

describe('Testing rest api to handle user stuff', () => {
	const server = request(app);

	const get = url => {
		return server.get('/api/v1');
	};

	const post = (url, body) => {
		return server.post('/api/v1' + url).send(body);
	};

	const deleteAllUsers = async () => {
		const { rows: allUsers } = await usersDB.list();
		allUsers.forEach(async user => {
			await usersDB.destroy(user.id, user.value.rev);
		});
		console.log('All users DELETED!');
	};

	const createTestUser = async () => {
		await post('/register', {
			email: 'test@test.com',
			password: '12345678'
		});
	};

	beforeAll(async () => {
		await deleteAllUsers();
		await createTestUser();
	});

	afterAll(async () => {
		await deleteAllUsers();
	});

	describe('Handling JWTs', () => {
		test('Correct credentials', async () => {
			const auth = { email: 'test@test.com', password: '12345678' };
			const res = await post('/authenticate', auth).expect(200);
			expect(res.body).toEqual(
				expect.objectContaining({
					ok: true,
					mes: 'Authenticated Successfully',
					token: expect.any(String)
				})
			);
		});
	});
});
