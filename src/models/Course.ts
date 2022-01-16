import { Model, model, ObjectId, Schema } from "mongoose";
import Bootcamp from "./Bootcamp";

interface ICourse {
  title: string;
  description: string;
  weeks: number;
  tuition: number;
  minimumSkill: string;
  scholarshipAvailable?: boolean;
  createdAt?: Date;
  bootcamp: ObjectId | string;
  model: Function;
}

interface ICourseModel extends Model<ICourse> {
  getAverageCost(bootcampId: ObjectId | string): void;
}

const schema = new Schema<ICourse, ICourseModel>({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: Number,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

/* 
Statics:
- Methods called on the actual model
Example:
Course.static()

Method:
- called on a query.
Example:
const course = Course.findById()
course.method()
*/

// static method to get average tuition of courses
schema.statics.getAverageCost = async function (bootcampId: ObjectId | string) {
  console.log("Calculating average cost...".blue);

  // "this" here refers to the model
  const averageCostObject = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  console.log("averageCostObject[0]: ", averageCostObject[0]);

  try {
    const bootcampModel: Model<Bootcamp> = this.prototype.model("Bootcamp");
    await bootcampModel.findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(averageCostObject[0].averageCost),
    });
  } catch (error) {
    console.error(error);
  }
};

// call .getAverageCost() after save
schema.post("save", function () {
  CourseModel.getAverageCost(this.bootcamp);
});

// call .getAverageCost() before delete
schema.pre("deleteOne", function () {
  CourseModel.getAverageCost(this.bootcamp);
});

const CourseModel = model<ICourse, ICourseModel>("Course", schema);

export default CourseModel;
