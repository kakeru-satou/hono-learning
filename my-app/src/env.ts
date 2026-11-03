const envSecretKey = process.env.JWT_SECRET;

if (!envSecretKey) {
  throw new Error("Secret Keyの環境変数(JWT_SECRET)が正しく設定されていません");
}

export const secretKey = envSecretKey;
