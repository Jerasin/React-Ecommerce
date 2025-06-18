export interface WalletInfo {
  id: number;
  name: string;
  token: string;
  uuid: string;
  user_id: number;
  value: number;
}

export interface CreateWallet {
  name: string;
  value: number;
  uuid: string;
  token: string;
  userId: number;
}
