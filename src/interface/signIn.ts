export interface SignInDataResponse {
  refresh_token: string;
  token: string;
}

export interface SignInResponse {
  data: SignInDataResponse;
  response_key: string;
  response_message: string;
}
