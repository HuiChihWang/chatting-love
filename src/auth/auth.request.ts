export interface SignInRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  expiredToken: string;
}
