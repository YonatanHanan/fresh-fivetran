# Freshworks data ingestion

As part of our Data project we created these AWS lambda functions that pull data from Freshcaller and Freshchat API's.

These functions are integrated into Fivetran the syncs it into our Data Warehouse.

To test run `npm run dev`.

To build and deploy `npm run build`.

To test locally each function separately `npm run freshchat` or `npm run freshdesk`.

We used **serverless** to deploy.  
The reason the function is using _Function URL_ and not _API Gateway_ is because the timeout limit.

Some of the type declarations are present but not used because we decided to implement the _transform_ phase via SQL.

![image](https://user-images.githubusercontent.com/6177147/168762844-46d23601-b753-4d9d-aba4-ff92ff155477.png)

API Reference links:

- [freshchat](https://developers.freshchat.com/api/)
- [freshcaller](https://developers.freshcaller.com/api/)
