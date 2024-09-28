import React from 'react';
import { Grid, Column } from '@carbon/react';
import { Document, Currency, Enterprise } from '@carbon/icons-react';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="page-title">Welcome to Receipt Management System</h1>
      <Grid narrow>
        <Column lg={5} md={4} sm={4}>
          <div className="feature-box">
            <Document size={32} />
            <h3>Manage Receipts</h3>
            <p>Easily upload and organize your receipts</p>
          </div>
        </Column>
        <Column lg={5} md={4} sm={4}>
          <div className="feature-box">
            <Currency size={32} />
            <h3>Track Expenses</h3>
            <p>Keep track of your expenses effortlessly</p>
          </div>
        </Column>
        <Column lg={5} md={4} sm={4}>
          <div className="feature-box">
            <Enterprise size={32} />
            <h3>Bank Integration</h3>
            <p>Seamlessly integrate with your bank accounts</p>
          </div>
        </Column>
      </Grid>
    </div>
  );
};

export default HomePage;