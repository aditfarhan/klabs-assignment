import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Attendance (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let staffId: string;
    let attendanceId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create a test staff
        const staffResponse = await request(app.getHttpServer())
            .post('/api/v1/staffs')
            .send({
                data: {
                    attributes: {
                        staffId: 'TEST001',
                        firstName: 'Test',
                        lastName: 'User',
                        username: 'testuser',
                        email: 'test@example.com',
                        password: 'password123',
                    },
                },
            })
            .expect(201);

        staffId = staffResponse.body.data[0].id;

        // Login to get access token
        const loginResponse = await request(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({
                data: {
                    attributes: {
                        username: 'testuser',
                        password: 'password123',
                    },
                },
            })
            .expect(201);

        accessToken = loginResponse.body.data[0].attributes.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/v1/attendance/clock-in', () => {
        it('should clock in successfully', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/attendance/clock-in')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);

            expect(response.body.data).toBeDefined();
            expect(response.body.data[0].attributes.status).toBe('clocked_in');
            expect(response.body.data[0].attributes.clockInTime).toBeDefined();

            attendanceId = response.body.data[0].id;
        });

        it('should fail if already clocked in today', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/attendance/clock-in')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(409); // Conflict
        });

        it('should fail without authentication', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/attendance/clock-in')
                .expect(403); // Forbidden
        });
    });

    describe('GET /api/v1/attendance/my', () => {
        it('should get my attendance history', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/attendance/my')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.meta).toBeDefined();
        });

        it('should support pagination', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/attendance/my?page=0&pageSize=5')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.meta.pageSize).toBe(5);
        });

        it('should fail without authentication', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/attendance/my')
                .expect(403);
        });
    });

    describe('POST /api/v1/attendance/clock-out/:id', () => {
        it('should clock out successfully', async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/v1/attendance/clock-out/${attendanceId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.data[0].attributes.status).toBe('clocked_out');
            expect(response.body.data[0].attributes.clockOutTime).toBeDefined();
        });

        it('should fail if already clocked out', async () => {
            await request(app.getHttpServer())
                .post(`/api/v1/attendance/clock-out/${attendanceId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(409);
        });

        it('should fail for non-existent attendance', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/attendance/clock-out/non-existent-id')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });

        it('should fail without authentication', async () => {
            await request(app.getHttpServer())
                .post(`/api/v1/attendance/clock-out/${attendanceId}`)
                .expect(403);
        });
    });

    describe('GET /api/v1/attendance/:id', () => {
        it('should get single attendance record', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/v1/attendance/${attendanceId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.data[0].id).toBe(attendanceId);
        });

        it('should fail for non-existent record', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/attendance/non-existent-id')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });

        it('should fail without authentication', async () => {
            await request(app.getHttpServer())
                .get(`/api/v1/attendance/${attendanceId}`)
                .expect(403);
        });
    });
});
