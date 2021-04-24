const mongoose = require('mongoose');
const validator = require('validator');

const trasnaction = mongoose.model('trasnaction', {
	from: {
		type: String,
		required: false,
	},
	to: {
		type: String,
		required: false,
	},
	operation_type: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
		validate(value) {
			if (value < 0) throw new Error('Positive amount please')
		}
	}
})

module.exports = trasnaction;
