import { cloudApi, serviceClients, Session } from "@yandex-cloud/nodejs-sdk";

const {
  storage: {
    bucket_service: { ListBucketsRequest },
  },
} = cloudApi;

const AUTH_TOKEN = process.env.YANDEX_CLOUD_AUTH_TOKEN!;
const FOLDER_ID = process.env.YANDEX_CLOUD_FOLDER_ID!;

(async () => {
  const session = new Session({ oauthToken: AUTH_TOKEN });
  const client = session.client(serviceClients.BucketServiceClient);

  const response = await client.list(
    ListBucketsRequest.fromPartial({ folderId: FOLDER_ID }),
  );

  for (const bucket of response.buckets) {
    console.log(bucket);
  }
})();
