import mongoose from "mongoose";

const ConfigConnect = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://admin:1234@cluster0.mgxihpr.mongodb.net/inquiry-handler-api?retryWrites=true&w=majority&appName=Cluster0",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("Database Connected");
      })
      .catch((error) => {
        console.log(error);
      });
  
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default ConfigConnect;
