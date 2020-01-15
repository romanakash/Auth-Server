import request from 'supertest';

import app from '../../app';
import { usersDB } from '../db';

describe('Testing rest api to handle user stuff', () => {
	const server = request(app);

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

	beforeAll(async () => await deleteAllUsers());
	afterAll(async () => await deleteAllUsers());

	describe('User registration', () => {
		test('No email or password is provided', async () => {
			const auth = {};
			const res = await post('/register', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({ err: true, mes: 'Email is required' })
			);
		});
		test("Email is provided, password isn't", async () => {
			const auth = { email: 'test@test.com' };
			const res = await post('/register', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Password is required'
				})
			);
		});
		test("Password is provided, email isn't", async () => {
			const auth = { password: 'password' };
			const res = await post('/register', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Email is required'
				})
			);
		});
		test('Password is shorter than 8 chars', async () => {
			const auth = { email: 'test@test.com', password: '1234567' };
			const res = await post('/register', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Password should have atleast 8 characters'
				})
			);
		});
		test('Correct details', async () => {
			const auth = { email: 'test@test.com', password: '12345678' };
			const res = await post('/register', auth).expect(201);
			expect(res.body).toEqual(
				expect.objectContaining({
					ok: true,
					mes: 'User successfully created',
					name: expect.any(String),
					date_joined: expect.any(String)
				})
			);
		});
		test('Duplicate user', async () => {
			const auth = { email: 'test@test.com', password: '12345678' };
			const res = await post('/register', auth).expect(409);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Email already exists'
				})
			);
		});
	});

	describe('Authenticate User', () => {
		test('No email or password is provided', async () => {
			const auth = {};
			const res = await post('/authenticate', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Request body should be of form {email:,password:}'
				})
			);
		});
		test("Email is provided, password isn't", async () => {
			const auth = { email: 'test@test.com' };
			const res = await post('/authenticate', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Request body should be of form {email:,password:}'
				})
			);
		});
		test("Password is provided, email isn't", async () => {
			const auth = { password: 'password' };
			const res = await post('/authenticate', auth).expect(400);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Request body should be of form {email:,password:}'
				})
			);
		});
		test('Incorrect email', async () => {
			const auth = { email: 'wrong@wrong.com', password: '12345678' };
			const res = await post('/authenticate', auth).expect(401);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Incorrect email or password'
				})
			);
		});
		test('Incorrect password', async () => {
			const auth = { email: 'test@test.com', password: '1234567' };
			const res = await post('/authenticate', auth).expect(401);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Incorrect email or password'
				})
			);
		});
		test('Incorrect email and password', async () => {
			const auth = { email: 'wrong@wrong.com', password: '1234567' };
			const res = await post('/authenticate', auth).expect(401);
			expect(res.body).toEqual(
				expect.objectContaining({
					err: true,
					mes: 'Incorrect email or password'
				})
			);
		});
		test('Correct credentials are provided', async () => {
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
