import ApiError from "../utilities/apiError";
import { clerkClient } from "../utilities/authservice";

const isUser = async (req, res, next) => {
  const userId = req.auth.userId;
  const user = await clerkClient.users.getUser(userId);

  if (!user) throw ApiError.notFound("User not found");
  if (!user.publicMetadata.role) throw ApiError.unauthorized("User role not defined");

  if (user.publicMetadata.role !== "user" && user.publicMetadata.role !== "both") {
      throw ApiError.forbidden("You are not authorized to access this route");
  }

  next();
};


const isSeller = async (req, res, next) => {
  const userId = req.auth.userId;
  const user = await clerkClient.users.getUser(userId);

  if (!user) throw ApiError.notFound("User not found");
  if (!user.publicMetadata.role) throw ApiError.unauthorized("User role not defined");

  if (user.publicMetadata.role !== "seller" && user.publicMetadata.role !== "both") {
      throw ApiError.forbidden("You are not authorized to access this route");
  }

  next();
};


export { isUser, isSeller}