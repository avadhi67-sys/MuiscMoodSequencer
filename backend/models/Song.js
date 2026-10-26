const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Song title is required'],
            trim: true
        },
        artist: {
            type: String,
            required: [true, 'Artist name is required'],
            trim: true
        },
        mood: {
            type: String,
            required: [true, 'Mood is required'],
            trim: true
        },
        energy: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
            default: 5
        },
        tempo: {
            type: Number,
            required: true,
            min: 40,
            max: 220,
            default: 120
        },
        audioUrl: {
            type: String,
            required: [true, 'Audio file or URL is required']
        },
        imageUrl: {
            type: String,
            default: ''
        },
        duration: {
            type: Number,
            default: 0
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

// Virtual field to provide numeric/string compatible 'id'
songSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

songSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
    }
});

module.exports = mongoose.model('Song', songSchema);
