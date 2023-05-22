"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var slugify_1 = __importDefault(require("slugify"));
var geocoder_1 = __importDefault(require("../utils/geocoder"));
var schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "name can not be more than 50 characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "please add a description"],
        maxlength: [500, "name can not be more than 500 characters"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use a valid URL with HTTP or HTTPS",
        ],
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        required: [true, "Please add careers"],
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Other",
        ],
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    id: false,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
// create "slug" for the name
schema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
// create "location" field from address
schema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, geocoder_1.default.geocode(this.address)];
                case 1:
                    location = _a.sent();
                    this.location = {
                        type: "Point",
                        coordinates: [location[0].longitude, location[0].latitude],
                        formattedAddress: location[0].formattedAddress,
                        street: location[0].streetName,
                        city: location[0].city,
                        state: location[0].state,
                        zipcode: location[0].zipcode,
                        country: location[0].country,
                    };
                    this.address = undefined;
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// cascase delete courses when their bootcamp is deleted
/* Explaining the cycle in controllers/bootcamps: deleteBootcamp function
- Bootcamp.findById() return a Query: https://mongoosejs.com/docs/queries.html
- So bootcamp = Bootcamp.findById() = Query
- To execute that query, await Query (await bootcamp)
- so bootcamp.deleteOne is considered Query#deleteOne()
- Query#deleteOne() triggers "deleteOne" pre hook
- with "this" = query
- To make "this" refer to the document, we add the 2nd argument
*/
schema.pre("deleteOne", { document: true, query: false }, function removeAttachedCourses(next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Removing courses from bootcamp: " + this._id);
                    return [4 /*yield*/, this.model("Course").deleteMany({ bootcamp: this._id })];
                case 1:
                    _a.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
/* virtiuals
- Basically, creates a virtual field that's not included in your model
(which then u can populate in your GET request)
- To receive in the response object, you have to add {toJson: {virtuals: true}} above in the model.
*/
schema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false,
});
var Bootcamp = (0, mongoose_1.model)("Bootcamp", schema);
exports.default = Bootcamp;
