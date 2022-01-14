import { Schema, model } from "mongoose";
import slugify from "slugify";
import geocoder from "../utils/geocoder";

interface Location {
  type: string;
  coordinates: number[];
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface Bootcamp {
  name: string;
  slug?: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  address: string;
  location?: Location;
  careers: string[];
  averageRating?: number;
  averageCost?: number;
  photo?: string;
  housing?: boolean;
  jobAssistance?: boolean;
  jobGuarantee?: boolean;
  acceptGi?: boolean;
  createdAt?: Date;
}

const schema = new Schema<Bootcamp>(
  {
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
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// create "slug" for the name
schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// create "location" field from address
schema.pre("save", async function (next) {
  const location = await geocoder.geocode(this.address);
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
schema.pre(
  "deleteOne",
  { document: true, query: false },
  async function removeAttachedCourses(next) {
    console.log(`Removing courses from bootcamp: ${this._id}`);
    await this.model("Course").deleteMany({ bootcamp: this._id });
    next();
  }
);

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

const Bootcamp = model<Bootcamp>("Bootcamp", schema);

export default Bootcamp;
