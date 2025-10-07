import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import type { AuthTokenPayload } from '../middlewares/auth.js';

export async function register(req: any, res: any) {
  const { email, username, password, display_name } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email en uso' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, password_hash: hash, display_name }); // role_id=2 por defecto

  const payload: AuthTokenPayload = {
    sub:  String(user.id), role: 'user', iat: Math.floor(Date.now()/1000)
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });

  res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
}

export async function login(req: any, res: any) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const role = user.role_id === 1 ? 'admin' : 'user';
  const payload: AuthTokenPayload = { sub:  String(user.id), role, iat: Math.floor(Date.now()/1000) };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });

  res.json({ token });
}

// (bonus) promover a admin manualmente
export async function promoteToAdmin(req: any, res: any) {
  const { id } = req.params;
  const user = await User.findByPk(Number(id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  user.role_id = 1;
  await user.save();

  res.json({ message: 'Usuario promovido a admin', id: user.id });
}
