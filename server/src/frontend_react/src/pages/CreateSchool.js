// CreateSchool.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

export default function CreateSchool() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [schoolType, setSchoolType] = useState('K12');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name,
      address,
      school_type: schoolType,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/schools/create-school/', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log('School created successfully', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('There was an error creating the school!', error);
    }
  };

  return (
    <Container>
      <h1>Create School</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>School Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter school name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formSchoolType">
          <Form.Label>School Type</Form.Label>
          <Form.Control
            as="select"
            value={schoolType}
            onChange={(e) => setSchoolType(e.target.value)}
            required
          >
            <option value="K12">K12</option>
            <option value="Tertiary">Tertiary</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create School
        </Button>
      </Form>
    </Container>
  );
}
