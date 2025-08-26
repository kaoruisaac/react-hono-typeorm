import { Hono } from 'hono';

const sampleRoute = new Hono();

sampleRoute.get('/:id', (c) => {
  const { id } = c.req.param();
  const { name } = c.req.query();
  // const body = await c.req.json();
  return c.json({ message: `Hello World ${id} ${name}` });
});

export default sampleRoute;