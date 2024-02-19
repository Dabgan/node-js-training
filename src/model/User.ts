import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true },
    roles: {
        User: {
            type: Number,
            default: 69,
        },
        Editor: Number,
        Admin: Number,
    },
    password: { type: String, required: true },
    refreshToken: String,
});

export default mongoose.model('User', userSchema);
