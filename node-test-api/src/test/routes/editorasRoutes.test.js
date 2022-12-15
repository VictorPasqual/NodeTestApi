import request from 'supertest';
import app from '../../app.js';

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});
afterEach(() => {
  server.close();
});

describe('GET em /editoras', () => {
  it('Deve retornar uma lista de editoras', async () => {
    const resposta = await request(app)
      .get('/editoras')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    expect(resposta.body[0].email).toEqual('e@e.com');
  });
});

let idResposta;

describe('POST em /editoras', () => {
  it('Deve adicionar uma nova editora', async () => {
    const resposta = await request(app)
      .post('/editoras')
      .send({
        nome: 'CDC',
        cidade: 'São Paulo',
        email: 's@s.com',
      })
      .expect(201);

    idResposta = resposta.body.content.id;
  });
  it('Deve map adicionar nada ao passsar o body vazio', async () => {
    await request(app)
      .post('/editoras')
      .send({})
      .expect(400);
  });
});

describe('GET em /editoras/id', () => {
  it('Deve retornar recurso selecionado', async () => {
    await request(app)
      .get(`/editoras/${idResposta}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  it.each([
    { nome: 'Casa do Código' },
    { cidade: 'SP' },
    { email: 'cdc@cdc.com' },
  ])('Deve alterar o campo nome', async (param) => {
    await request(app)
      .put(`/editoras/${idResposta}`)
      .send(param)
      .expect(204);
  });
});

describe('DELETE em /editoras', () => {
  it('Deletar o recurso adcionado', async () => {
    await request(app)
      .delete(`/editoras/${idResposta}`)
      .expect(200);
  });
});
