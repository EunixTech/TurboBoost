const slug = require(`slug`);

const toExport = {

    defaultSort: {
        createdAt: -1,
        status: 1
    },

    defaultStringConfig: {
        type: String,
        default: ``,
        trim: true
    },

    defaultNumberConfig: {
        type: Number,
        default: 0,
    },

    defaultObjectConfig:{
        type:Object,
        default:false
    },

    defaultBooleanConfig: {
        type: Boolean,
        default: false
    },

    fieldsToExclude: {
        createdAt: false,
        updatedAt: false,
        __v: false
    },

    getSlug(providedString = ``, charCount = 6) {
        return slug(String(providedString));
        /**
         * At rate of 500 IDs/hour; ~1 hour needed, in order to have a 1% probability of at least one collision.
         * Checked at: https://zelark.github.io/nano-id-cc/
         */
    },
  

};


module.exports = toExport;