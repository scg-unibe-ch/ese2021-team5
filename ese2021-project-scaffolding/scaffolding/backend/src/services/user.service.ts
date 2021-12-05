import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {


  public register(user: UserAttributes): Promise<UserAttributes> {
    const saltRounds = 12;
    user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext
    return User.findOne({
      where: {
        userName: user.userName
      }
    })
      .then(foundUser => {
        if (foundUser == null) {
          return User.findOne({
            where: {
              email: user.email
            }
          })
            .then(foundUser2 => {
              // tslint:disable-next-line:max-line-length
              if (foundUser2 == null) {
                return User.create(user).then(inserted => Promise.resolve(inserted));
                // tslint:disable-next-line:max-line-length
              } else { return Promise.reject({ message: 'The email you gave is already connected to an account, please use another one.', isEmailTakes: true }); }
            });

        } else {
          return Promise.reject({ message: 'This username is already used, please use another one and try again.', isUsernameTaken: true });
        }
      })
      .catch(err => Promise.reject({ message: err }));
  }

  public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
    const secret = process.env.JWT_SECRET;
    return User.findOne({
      where: {
        userName: loginRequestee.userName
      }
    })
      .then(user => {
        // tslint:disable-next-line:max-line-length
        if (user == null) { return Promise.reject({ message: 'This username does not exist, note that case matters.', isUsernameCorrect: false }); }
        if (bcrypt.compareSync(loginRequestee.password, user.password)) {// compares the hash with the password from the login request
          const token: string = jwt.sign({ userName: user.userName, userId: user.userId, admin: user.admin }, secret, { expiresIn: '2h' });
          return Promise.resolve({ user, token });
        } else {
          return Promise.reject({ message: 'This password is incorrect', isPasswordCorrect: false });
        }
      })
      .catch(err => Promise.reject({ message: err }));
  }

  public getAll(): Promise<User[]> {
    // uncomment commented section if useful
    return User.findAll(/*{ include: [User.associations.orders] }*/);
  }

}
