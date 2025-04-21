import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "something went wrong";
  console.log(msg);
  res
    .status(statusCode)
    .json({ msg: "something went wrong", errorMessage: msg });
};

export default errorHandlerMiddleware;
