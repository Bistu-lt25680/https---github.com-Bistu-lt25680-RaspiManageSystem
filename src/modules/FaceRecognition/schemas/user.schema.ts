import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    face_token: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    college: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
