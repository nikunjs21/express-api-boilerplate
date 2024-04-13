import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser {
  name: string;
  email: string;
  password: string;
  mobile: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 30,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email!');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 30,
      validate(value: string) {
        if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)) {
          throw new Error(
            'Password should have minimum 8 and maximum 30 characters length, at least one uppercase letter, one lowercase letter, one number and one special character.',
          );
        }
      },
    },
    mobile: {
      type: String,
      required: false,
      unique: true,
      maxlength: 15,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
