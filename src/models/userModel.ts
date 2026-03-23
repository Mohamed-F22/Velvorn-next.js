import  {Schema, Document, model, models} from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string
}

const userSchema = new Schema<IUser> ({
  fullName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
})

const userModel =
  models.user || model<IUser>("user", userSchema);

export default userModel;