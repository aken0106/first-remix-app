// routes/api.products.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      products(first: 10) {
        nodes {
          id
          title
        }
      }
    }
  `);

  const data = await response.json();
  return json(data.data.products.nodes);
}
