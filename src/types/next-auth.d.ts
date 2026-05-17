import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    credits: number;
  }

  interface Session {
    user: User & {
      id: string;
      credits: number;
    };
  }
}
