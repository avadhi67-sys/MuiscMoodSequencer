const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Artist name is required'],
            unique: true,
            trim: true
        },
        mood: {
            type: String,
            trim: true,
            default: ''
        },
        bio: {
            type: String,
            trim: true,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

artistSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

artistSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
    }
});

module.exports = mongoose.model('Artist', artistSchema);
