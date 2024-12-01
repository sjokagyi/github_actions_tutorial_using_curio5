// src/contexts/test-reducer/TestContext.jsx

import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Define initial state
const initialState = {
    tests: [],
    loading: false,
    error: null,
};

// Define actions
const FETCH_TESTS_REQUEST = 'FETCH_TESTS_REQUEST';
const FETCH_TESTS_SUCCESS = 'FETCH_TESTS_SUCCESS';
const FETCH_TESTS_FAILURE = 'FETCH_TESTS_FAILURE';
const ADD_TEST = 'ADD_TEST';

// Create context
const TestContext = createContext(initialState);

// Reducer
const testReducer = (state, action) => {
    switch (action.type) {
        case FETCH_TESTS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_TESTS_SUCCESS:
            return { ...state, loading: false, tests: action.payload, error: null };
        case FETCH_TESTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_TEST:
            return { ...state, tests: [...state.tests, action.payload] };
        default:
            return state;
    }
};

// Provider component
const TestProvider = ({ children }) => {
    const [state, dispatch] = useReducer(testReducer, initialState);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        dispatch({ type: FETCH_TESTS_REQUEST });
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/questions/tests/');
            dispatch({ type: FETCH_TESTS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: FETCH_TESTS_FAILURE, payload: error.message });
        }
    };

    const addTest = async (test) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/questions/tests/', test);
            dispatch({ type: ADD_TEST, payload: response.data });
        } catch (error) {
            dispatch({ type: FETCH_TESTS_FAILURE, payload: error.message });
        }
    };

    return (
        <TestContext.Provider value={{ ...state, addTest }}>
            {children}
        </TestContext.Provider>
    );
};

export { TestContext, TestProvider };
