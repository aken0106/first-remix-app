import { useState, useCallback } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Select,
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query getLocations {
        locations(first: 50) {
          edges {
            node {
              id
              name
              address {
                address1
                address2
                city
                province
                country
                zip
              }
              isActive
              shipsInventory
              fulfillsOnlineOrders
            }
          }
        }
      }`
  );

  const responseJson = await response.json();

  return {
    locations: responseJson.data.locations.edges
  };
};

export default function Index() {
  console.log('locations')
  const [selected, setSelected] = useState('Locations');

  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  const options = [
    { label: 'Locations', value: 'location' },
    { label: 'Companies', value: 'company' },
    { label: 'Users', value: 'user' },
  ];
  const locationOptions = [
    { label: 'First', value: 'first' },
    { label: 'Last', value: 'last' },
    { label: 'Query', value: 'title' },
  ];

  const companyOptions = [
    { label: 'Approve', value: 'Approved' },
    { label: 'Not Approve', value: 'pending' },
  ];

  const userOptions = [
    { label: 'Admin', value: 'adminstrartor' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
  ];

  let optionsToDisplay = [];
  console.log('selected', selected)
  if (selected === 'location') optionsToDisplay = locationOptions;
  if (selected === 'company') optionsToDisplay = companyOptions;
  if (selected === 'user') optionsToDisplay = userOptions;

  return (
    <Page>
      <TitleBar title="CSV download app">
        {/* <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button> */}
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <Select
                label="Select options"
                options={options}
                onChange={handleSelectChange}
                value={selected}
              />
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              {/* Second select: depends on first selection */}
              <Select
                label={`Select ${selected}`}
                options={optionsToDisplay}
                onChange={() => { }}
                value=""
              />
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
