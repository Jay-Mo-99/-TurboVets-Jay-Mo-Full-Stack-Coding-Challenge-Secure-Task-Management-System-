import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserService {
  private users: User[] = [];

  async register(email: string, username: string, password: string) {
    if (this.users.find((u) => u.email === email)) {
      throw new Error("Email already exists");
    }
    
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { email, username, passwordHash };
    this.users.push(user);
    return { email, username };
  }

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid email or password");
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid email or password");
    
    // JWT 발급 (secret은 환경변수로 관리 권장)
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: '24h' }
    );
    return { token };
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }
}
