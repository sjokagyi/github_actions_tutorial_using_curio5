import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateTest = () => {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        school: '',
        title: '',
        author: '',
        programme: '',
        course: '',
        grade: '',
        term: '',
        test_type: 'MCQ',
        max_time: '',
        start_time: '',
        end_time: '',
        auto_mark: false,
        questions: []
    });

    const [programmes, setProgrammes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData(prevFormData => ({
                ...prevFormData,
                author: user.id// Set the school field to the user's school ID
            }));
            fetchInitialData();
        }
    }, [user]);

    const fetchInitialData = async () => {
        setLoading(true);
        setError(null);

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

            setProgrammes(Array.isArray(programmeResponse.data.results) ? programmeResponse.data.results : []);
            setGrades(Array.isArray(gradeResponse.data.results) ? gradeResponse.data.results : []);
            setTerms(Array.isArray(termResponse.data.results) ? termResponse.data.results : []);
        } catch (error) {
            setError('Failed to fetch initial data');
        } finally {
            setLoading(false);
        }
    };

    const handleProgrammeChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'programme') {
            fetchCourses(value);
        }
    };

    const fetchCourses = async (programmeId) => {
        if (!user) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/programmes/${programmeId}/courses/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                setError('Unexpected response format for courses');
            }
        } catch (error) {
            setError('Failed to fetch courses');
        }
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { question_type: formData.test_type === 'MX' ? '' : formData.test_type, content: '', choices: [], marks: '', fill_in_the_blanks_data: '', image: null, video: null, correct_answer: true, explanation_enabled: false, explanation_text: '', author: user.id, test: null}]
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleAddChoice = (questionIndex) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].choices.push({ content: '', is_correct: false, question: null});
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
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        const testPayload = {
            school: user.school.id, 
            title: formData.title,
            author: user.id,
            programme: formData.programme,
            course: formData.course,
            grade: formData.grade,
            term: formData.term,
            test_type: formData.test_type,
            max_time: formData.max_time,
            start_time: formData.start_time,
            end_time: formData.end_time,
            auto_mark: formData.auto_mark,
            questions: formData.questions.map(question => ({
                school: user.school.id, 
                question_type: question.question_type,
                content: question.content,
                marks: question.marks,
                fill_in_the_blanks_data: question.fill_in_the_blanks_data,
                image: question.image,
                video: question.video,
                correct_answer: question.correct_answer,
                explanation_enabled: question.explanation_enabled,
                explanation_text: question.explanation_text,
                author: user.id,
                choices: question.choices.map(choice => ({
                    school: user.school.id, 
                    question: question.id,
                    content: choice.content,
                    is_correct: choice.is_correct
                }))
            })),
        };

        console.log("Submitting Test Payload: ", testPayload); // Debugging statement

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/questions/tests/', testPayload, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });

            alert('Test created successfully');
            setFormData({
                school: '',
                title: '',
                author: user.id,
                programme: '',
                course: '',
                grade: '',
                term: '',
                test_type: 'MCQ',
                max_time: '',
                start_time: '',
                end_time: '',
                auto_mark: false,
                questions: []
            });
        } catch (error) {
            console.log("Error Response: ", error.response); // Debugging statement
            if (error.response && error.response.data) {
                alert('Error creating test: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error creating test: ' + error.message);
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
            <Typography variant="h6">Create Test</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                autoFocus
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="programme-label">Programme</InputLabel>
                <Select
                    labelId="programme-label"
                    id="programme"
                    name="programme"
                    value={formData.programme}
                    onChange={handleProgrammeChange}
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
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
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
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
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
                id="author"
                label="Author"
                name="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                disabled
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="test_type-label">Type of Test</InputLabel>
                <Select
                    labelId="test_type-label"
                    id="test_type"
                    name="test_type"
                    value={formData.test_type}
                    onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
                >
                    <MenuItem value="MCQ">Multiple Choice Questions</MenuItem>
                    <MenuItem value="SA">Short Answer</MenuItem>
                    <MenuItem value="TF">True or False</MenuItem>
                    <MenuItem value="ES">Essay</MenuItem>
                    <MenuItem value="FB">Fill in the Blanks</MenuItem>
                    <MenuItem value="MX">Mixed</MenuItem>
                </Select>
            </FormControl>
            <TextField
                margin="normal"
                required
                fullWidth
                id="max_time"
                label="Max Time"
                name="max_time"
                value={formData.max_time}
                onChange={(e) => setFormData({ ...formData, max_time: e.target.value })}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="start_time"
                label="Start Time"
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
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
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
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
                    value={formData.auto_mark}
                    onChange={(e) => setFormData({ ...formData, auto_mark: e.target.value })}
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

            {formData.questions.map((question, index) => (
                <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mt: 2 }}>
                    {formData.test_type === 'MX' && (
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
                    )}
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
                Create Test
            </Button>
        </Box>
    );
};

export default CreateTest;
