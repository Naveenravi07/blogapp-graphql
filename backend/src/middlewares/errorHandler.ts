import { NextFunction, Request, Response } from "express";
import AppError from "../classes/Error";

export async function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  } else {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
