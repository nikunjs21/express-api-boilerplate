import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import plugins from './plugins';
import rolesObj from '../config/roles';

const { toJSON, paginate } = plugins;
const { roles } = rolesObj;

interface IUser {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch: Function;
  isEmailTaken: Function;
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
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password: any) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model<IUser>('User', userSchema);

export default User;
