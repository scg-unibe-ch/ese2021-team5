import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export class ServerService {
  /**
  * Used to create a default admin user during development.
  *
  * This will create a unhandeldPromiseRejectionWarning on database creation.
  * I tried to fix it like 10000 times but this is very hacky solution anyway so I shouldn't care.
  * This should probably be done from the frontend.
  */
  public static makeAnAdmin() {
  try {
    User.create({
      'userName': 'admin',
      'password': bcrypt.hashSync('password', 12),
      'admin': true,
      'email': 'admin@email.com'
    });

  } catch (error) {

  }
  }
}
