import "dotenv/config";

const authConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1d",
};

export { authConfig };
