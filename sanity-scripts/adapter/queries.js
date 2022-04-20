"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationTokenQuery = exports.getUserByEmailQuery = exports.getUserByProviderAccountIdQuery = exports.getUserByIdQuery = void 0;
const groq_1 = __importDefault(require("groq"));
exports.getUserByIdQuery = groq_1.default `
  *[_type == $userSchema && _id == $id][0]
`;
exports.getUserByProviderAccountIdQuery = groq_1.default `
  *[_type == $accountSchema && providerId == $providerId && providerAccountId == $providerAccountId] {
    accessToken,
    accessTokenExpires,
    providerId,
    providerType,
    providerAccountId,
    user->
  }[0]
`;
exports.getUserByEmailQuery = groq_1.default `
  *[_type == $userSchema && email == $email][0]
`;
exports.getVerificationTokenQuery = groq_1.default `
  *[_type == $verificationTokenSchema && identifier == $identifier && token == $token][0]
`;
