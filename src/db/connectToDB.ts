import conf from "@/conf/conf";
import { DB_NAME } from "@/constants";
import mongoose from "mongoose";

export default async function connectToDB() {
  try {
    await mongoose
      .connect(`${conf.mongoDbUri}/${DB_NAME}`)
      .then(function () {
        console.log(
          `Successfully connected to DB on host : ${mongoose.connection.host}`
        );
      })
      .catch(function (error: any) {
        console.log(
          `Something went wrong while making a connection to database : ERROR : ${error.message}`
        );
        process.exit();
      });
  } catch (error: any) {
    console.log(
      `Error while connecting to database : ERROR : ${error.message}`
    );
  }
}
