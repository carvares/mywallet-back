import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';


beforeEach(async () => {
    await connection.query(`DELETE FROM users`);
  });

describe("post /registry", () => {
    it("returns status 201 for valid params on registry", async () => {
        const result = await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:"123456"});
        expect(result.status).toEqual(201);
    });
    it("returns status 409 for user already on registry", async () => {
        const firstTry = await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:"123456"});
        expect(firstTry.status).toEqual(201);
        const secondTry = await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:"123456"});
        expect(secondTry.status).toEqual(409);
    });
    it("returns status 401 for params not acepted on registry", async () => {
        const emailtest = await supertest(app).post("/registry").send({name: "joão", email:"", password:"123456"});
        expect(emailtest.status).toEqual(401);
    }); 
    it("returns status 401 for params not acepted on registry", async () => {
        const nametest = await supertest(app).post("/registry").send({name: "", email:"joao@teste.com", password:"123456"});
        expect(nametest.status).toEqual(401);
    }); 
    it("returns status 401 for params not acepted on registry", async () => {
        const passwordtest = await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:""});
        expect(passwordtest.status).toEqual(401);
    }); 
        
});
describe("post /login",()=>{
    it("returns status 200 for valid params on login", async () =>{
        await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:"123456"});
        const loginsucess = await supertest(app).post("/login").send({email:"joao@teste.com", password:"123456"});
        expect(loginsucess.status).toEqual(200);
    })   
    it("returns status 401 for invalid params on login", async () =>{
        await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:"123456"});
        const loginfailpassword = await supertest(app).post("/login").send({email:"joao@teste.com", password:"12345"});
        expect(loginfailpassword.status).toEqual(401);
    })   
    it("returns status 401 for invalid params on login", async () =>{
        await supertest(app).post("/registry").send({name: "joão", email:"joao@teste.com", password:"123456"});
        const loginfailemail = await supertest(app).post("/login").send({email:"joao@teste2.com", password:"123456"});
        expect(loginfailemail.status).toEqual(401);
    })   
})



afterAll(() => {
    connection.end();
  });
