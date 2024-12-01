import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const EditTestForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        programme: '',
        course: '',
        grade: '',
        term: '',
        max_time: '',
        start_time: '',
        end_time: '',
        auto_mark: false,
        questions: []  // Ensure questions is initialized as an empty array
    });
    const [programmes, setProgrammes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchTest();
            fetchInitialData();
        }
    }, [user]);

    const fetchTest = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/questions/tests/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            const test = response.data;
            if (!test.questions) {
                test.questions = [];
            }
            setFormData(test);
        } catch (error) {
            console.error('Error fetching test:', error);
            setError('Failed to fetch test');
        } finally {
            setLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            const [programmeResponse, gradeResponse, termResponse] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/accounts/programmes/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    },
                    params: {
                        school: user.school.id
                    }
                }),
                axios.get(`http://127.0.0.1:8000/api/accounts/grades/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    },
                    params: {
                        school: user.school.id
                    }
                }),
                axios.get(`http://127.0.0.1:8000/api/accounts/terms/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    },
                    params: {
                        school: user.school.id
                    }
                })
            ]);

            setProgrammes(programmeResponse.data.results);
            setGrades(gradeResponse.data.results);
            setTerms(termResponse.data.results);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setError('Failed to fetch initial data');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'programme') {
            fetchCourses(value);
        }
    };

    const fetchCourses = async (programmeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/programmes/${programmeId}/courses/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setCourses(response.data.results);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses');
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { question_type: 'MCQ', content: '', choices: [], marks: '', fill_in_the_blanks_data: '', image: null, video: null, correct_answer: true, explanation_enabled: false, explanation_text: '' }]
        });
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleAddChoice = (questionIndex) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].choices.push({ content: '', is_correct: false });
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleChoiceChange = (questionIndex, choiceIndex, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].choices[choiceIndex][field] = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleRemoveChoice = (questionIndex, choiceIndex) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].choices = updatedQuestions[questionIndex].choices.filter((_, i) => i !== choiceIndex);
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/questions/tests/${id}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Test updated successfully');
        } catch (error) {
            console.error('Error updating test:', error);
            alert('Error updating test');
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
            <Typography variant="h6">Edit Test</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                autoFocus
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="programme-label">Programme</InputLabel>
                <Select
                    labelId="programme-label"
                    id="programme"
                    name="programme"
                    value={formData.programme || ''}
                    onChange={handleChange}
                >
                    {programmes.map((programme) => (
                        <MenuItem key={programme.id} value={programme.id}>
                            {programme.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="course-label">Course</InputLabel>
                <Select
                    labelId="course-label"
                    id="course"
                    name="course"
                    value={formData.course || ''}
                    onChange={handleChange}
                >
                    {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                            {course.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="grade-label">Grade</InputLabel>
                <Select
                    labelId="grade-label"
                    id="grade"
                    name="grade"
                    value={formData.grade || ''}
                    onChange={handleChange}
                >
                    {grades.map((grade) => (
                        <MenuItem key={grade.id} value={grade.id}>
                            {grade.grade}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="term-label">Term</InputLabel>
                <Select
                    labelId="term-label"
                    id="term"
                    name="term"
                    value={formData.term || ''}
                    onChange={handleChange}
                >
                    {terms.map((term) => (
                        <MenuItem key={term.id} value={term.id}>
                            {term.term}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                margin="normal"
                required
                fullWidth
                id="max_time"
                label="Max Time"
                name="max_time"
                value={formData.max_time || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="start_time"
                label="Start Time"
                name="start_time"
                type="datetime-local"
                value={formData.start_time || ''}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="end_time"
                label="End Time"
                name="end_time"
                type="datetime-local"
                value={formData.end_time || ''}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="auto_mark-label">Auto Mark</InputLabel>
                <Select
                    labelId="auto_mark-label"
                    id="auto_mark"
                    name="auto_mark"
                    value={formData.auto_mark || false}
                    onChange={handleChange}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Questions
                <IconButton onClick={handleAddQuestion}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </Typography>

            {Array.isArray(formData.questions) && formData.questions.map((question, index) => (
                <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mt: 2 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id={`question_type-label-${index}`}>Question Type</InputLabel>
                        <Select
                            labelId={`question_type-label-${index}`}
                            id={`question_type-${index}`}
                            name={`question_type-${index}`}
                            value={question.question_type}
                            onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                        >
                            <MenuItem value="MCQ">Multiple Choice Questions</MenuItem>
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
                        id={`content-${index}`}
                        label="Content"
                        name={`content-${index}`}
                        value={question.content}
                        onChange={(e) => handleQuestionChange(index, 'content', e.target.value)}
                    />
                    {question.question_type === 'FB' && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={`fill_in_the_blanks_data-${index}`}
                            label="Fill in the Blanks Data"
                            name={`fill_in_the_blanks_data-${index}`}
                            value={question.fill_in_the_blanks_data}
                            onChange={(e) => handleQuestionChange(index, 'fill_in_the_blanks_data', e.target.value)}
                        />
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={`marks-${index}`}
                        label="Marks"
                        name={`marks-${index}`}
                        value={question.marks}
                        onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                    />
                    {question.question_type === 'TF' && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel id={`correct_answer-label-${index}`}>Correct Answer</InputLabel>
                            <Select
                                labelId={`correct_answer-label-${index}`}
                                id={`correct_answer-${index}`}
                                name={`correct_answer-${index}`}
                                value={question.correct_answer}
                                onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id={`explanation_enabled-label-${index}`}>Explanation Enabled</InputLabel>
                        <Select
                            labelId={`explanation_enabled-label-${index}`}
                            id={`explanation_enabled-${index}`}
                            name={`explanation_enabled-${index}`}
                            value={question.explanation_enabled}
                            onChange={(e) => handleQuestionChange(index, 'explanation_enabled', e.target.value)}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                    </FormControl>
                    {question.explanation_enabled && (
                        <TextField
                            margin="normal"
                            fullWidth
                            id={`explanation_text-${index}`}
                            label="Explanation Text"
                            name={`explanation_text-${index}`}
                            value={question.explanation_text}
                            onChange={(e) => handleQuestionChange(index, 'explanation_text', e.target.value)}
                        />
                    )}
                    <IconButton onClick={() => handleRemoveQuestion(index)}>
                        <DeleteIcon />
                    </IconButton>
                    {question.question_type === 'MCQ' && (
                        <>
                            <Typography variant="h6">Choices</Typography>
                            {question.choices.map((choice, choiceIndex) => (
                                <Box key={choiceIndex} sx={{ border: '1px solid #ccc', p: 1, mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id={`choice_content-${index}-${choiceIndex}`}
                                        label="Content"
                                        name={`choice_content-${index}-${choiceIndex}`}
                                        value={choice.content}
                                        onChange={(e) => handleChoiceChange(index, choiceIndex, 'content', e.target.value)}
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id={`choice_is_correct-label-${index}-${choiceIndex}`}>Is Correct</InputLabel>
                                        <Select
                                            labelId={`choice_is_correct-label-${index}-${choiceIndex}`}
                                            id={`choice_is_correct-${index}-${choiceIndex}`}
                                            name={`choice_is_correct-${index}-${choiceIndex}`}
                                            value={choice.is_correct}
                                            onChange={(e) => handleChoiceChange(index, choiceIndex, 'is_correct', e.target.value)}
                                        >
                                            <MenuItem value={true}>Yes</MenuItem>
                                            <MenuItem value={false}>No</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <IconButton onClick={() => handleRemoveChoice(index, choiceIndex)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <IconButton onClick={() => handleAddChoice(index)}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </>
                    )}
                </Box>
            ))}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Update Test
            </Button>
        </Box>
    );
};

export default EditTestForm;

