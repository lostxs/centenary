import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "~/shared/lib/utils";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
