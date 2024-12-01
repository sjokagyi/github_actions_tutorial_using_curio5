import React, { useState, useContext, useEffect } from 'react'; // Added useEffect import
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateQuestion = () => {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        author: user.id,
        test: '',
        question_type: 'MCQ',
        content: '',
        fill_in_the_blanks_data: '',
        image: null,
        video: null,
        marks: '',
        correct_answer: true,
        explanation_enabled: false,
        explanation_text: '',
        choices: []
    });

    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/questions/tests/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });

            setTests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError('Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const handleAddChoice = () => {
        setFormData({
            ...formData,
            choices: [...formData.choices, { content: '', is_correct: false }]
        });
    };

    const handleChoiceChange = (index, field, value) => {
        const updatedChoices = [...formData.choices];
        updatedChoices[index][field] = value;
        setFormData({ ...formData, choices: updatedChoices });
    };

    const handleRemoveChoice = (index) => {
        const updatedChoices = formData.choices.filter((_, i) => i !== index);
        setFormData({ ...formData, choices: updatedChoices });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        const questionPayload = {
            ...formData,
            author: user.id
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/questions/questions/', questionPayload, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });

            alert('Question created successfully');
            setFormData({
                author: user.id,
                test: '',
                question_type: 'MCQ',
                content: '',
                fill_in_the_blanks_data: '',
                image: null,
                video: null,
                marks: '',
                correct_answer: true,
                explanation_enabled: false,
                explanation_text: '',
                choices: []
            });
        } catch (error) {
            if (error.response && error.response.data) {
                alert('Error creating question: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error creating question: ' + error.message);
            }
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Question</Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel id="test-label">Test</InputLabel>
                <Select
                    labelId="test-label"
                    id="test"
                    name="test"
                    value={formData.test}
                    onChange={(e) => setFormData({ ...formData, test: e.target.value })}
                >
                    {tests.map((test) => (
                        <MenuItem key={test.id} value={test.id}>
                            {test.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="question_type-label">Question Type</InputLabel>
                <Select
                    labelId="question_type-label"
                    id="question_type"
                    name="question_type"
                    value={formData.question_type}
                    onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                >
                    <MenuItem value="MCQ">Multiple Choice Question</MenuItem>
                    <MenuItem value="SA">Short Answer</MenuItem>
                    <MenuItem value="TF">True or False</MenuItem>
                    <MenuItem value="ES">Essay</MenuItem>
                    <MenuItem value="FB">Fill in the Blanks</MenuItem>
                </Select>
            </FormControl>
            <TextField
                margin="normal"
                required
                fullWidth
                id="content"
                label="Content"
                name="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {formData.question_type === 'FB' && (
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="fill_in_the_blanks_data"
                    label="Fill in the Blanks Data"
                    name="fill_in_the_blanks_data"
                    value={formData.fill_in_the_blanks_data}
                    onChange={(e) => setFormData({ ...formData, fill_in_the_blanks_data: e.target.value })}
                />
            )}
            <TextField
                margin="normal"
                required
                fullWidth
                id="marks"
                label="Marks"
                name="marks"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
            />
            {formData.question_type === 'TF' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel id="correct_answer-label">Correct Answer</InputLabel>
                    <Select
                        labelId="correct_answer-label"
                        id="correct_answer"
                        name="correct_answer"
                        value={formData.correct_answer}
                        onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    >
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                    </Select>
                </FormControl>
            )}
            <FormControl fullWidth margin="normal">
                <InputLabel id="explanation_enabled-label">Explanation Enabled</InputLabel>
                <Select
                    labelId="explanation_enabled-label"
                    id="explanation_enabled"
                    name="explanation_enabled"
                    value={formData.explanation_enabled}
                    onChange={(e) => setFormData({ ...formData, explanation_enabled: e.target.value })}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>
            {formData.explanation_enabled && (
                <TextField
                    margin="normal"
                    fullWidth
                    id="explanation_text"
                    label="Explanation Text"
                    name="explanation_text"
                    value={formData.explanation_text}
                    onChange={(e) => setFormData({ ...formData, explanation_text: e.target.value })}
                />
            )}
            <Typography variant="h6" sx={{ mt: 2 }}>
                Choices
                <IconButton onClick={handleAddChoice}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </Typography>
            {formData.choices.map((choice, index) => (
                <Box key={index} sx={{ border: '1px solid #ccc', p: 1, mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={`choice_content-${index}`}
                        label="Content"
                        name={`choice_content-${index}`}
                        value={choice.content}
                        onChange={(e) => handleChoiceChange(index, 'content', e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id={`choice_is_correct-label-${index}`}>Is Correct</InputLabel>
                        <Select
                            labelId={`choice_is_correct-label-${index}`}
                            id={`choice_is_correct-${index}`}
                            name={`choice_is_correct-${index}`}
                            value={choice.is_correct}
                            onChange={(e) => handleChoiceChange(index, 'is_correct', e.target.value)}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={() => handleRemoveChoice(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create Question
            </Button>
        </Box>
    );
};

export default CreateQuestion;
