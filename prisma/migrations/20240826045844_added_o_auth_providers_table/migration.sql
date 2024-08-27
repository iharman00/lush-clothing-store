-- CreateTable
CREATE TABLE "oAuth_accounts" (
    "providerId" TEXT NOT NULL,
    "providerUser" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "oAuth_accounts_pkey" PRIMARY KEY ("providerId","providerUser")
);

-- AddForeignKey
ALTER TABLE "oAuth_accounts" ADD CONSTRAINT "oAuth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
