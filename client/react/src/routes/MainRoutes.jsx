// src/routes/MainRoutes.jsx

import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import PrivateRoute from 'components/PrivateRoute'; 

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
//School Admin Dashboard
    //User Management
const UserManagement = Loadable(lazy(() => import('pages/extra-pages/UserManagement')));
        //Admin
const Admin = Loadable(lazy(() => import('pages/extra-pages/Admin')));
const EditAdminSearch = Loadable(lazy(() => import('pages/extra-pages/EditAdminSearch')));
const EditAdminForm = Loadable(lazy(() => import('pages/extra-pages/EditAdminForm')));
const DeleteAdminSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteAdminSearch')));
        //Staff
const Staff = Loadable(lazy(() => import('pages/extra-pages/Staff')));
const EditStaffSearch = Loadable(lazy(() => import('pages/extra-pages/EditStaffSearch')));
const EditStaffForm = Loadable(lazy(() => import('pages/extra-pages/EditStaffForm')));
const DeleteStaffSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteStaffSearch')));
        //Student
const Student = Loadable(lazy(() => import('pages/extra-pages/Student')));
const EditStudentSearch = Loadable(lazy(() => import('pages/extra-pages/EditStudentSearch')));
const EditStudentForm = Loadable(lazy(() => import('pages/extra-pages/EditStudentForm')));
const DeleteStudentSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteStudentSearch')));
    //School Management
const SchoolManagement = Loadable(lazy(() => import('pages/extra-pages/SchoolManagement')));
        //College
const College = Loadable(lazy(() => import('pages/extra-pages/College')));
const CreateCollege = Loadable(lazy(() => import('pages/extra-pages/CreateCollege')));
const EditCollegeSearch = Loadable(lazy(() => import('pages/extra-pages/EditCollegeSearch')));
const EditCollegeForm = Loadable(lazy(() => import('pages/extra-pages/EditCollegeForm')));
const DeleteCollegeSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteCollegeSearch')));
        //Faculty
const Faculty = Loadable(lazy(() => import('pages/extra-pages/Faculty')));
const CreateFaculty = Loadable(lazy(() => import('pages/extra-pages/CreateFaculty')));
const EditFacultySearch = Loadable(lazy(() => import('pages/extra-pages/EditFacultySearch')));
const EditFacultyForm = Loadable(lazy(() => import('pages/extra-pages/EditFacultyForm')));
const DeleteFacultySearch = Loadable(lazy(() => import('pages/extra-pages/DeleteFacultySearch')));
        //Programme
const Programme = Loadable(lazy(() => import('pages/extra-pages/Programme')));
const CreateProgramme = Loadable(lazy(() => import('pages/extra-pages/CreateProgramme')));
const EditProgrammeSearch = Loadable(lazy(() => import('pages/extra-pages/EditProgrammeSearch')));
const EditProgrammeForm = Loadable(lazy(() => import('pages/extra-pages/EditProgrammeForm')));
const DeleteProgrammeSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteProgrammeSearch')));
        //Course
const Course = Loadable(lazy(() => import('pages/extra-pages/Course')));
const CreateCourse = Loadable(lazy(() => import('pages/extra-pages/CreateCourse')));
const EditCourseSearch = Loadable(lazy(() => import('pages/extra-pages/EditCourseSearch')));
const EditCourseForm = Loadable(lazy(() => import('pages/extra-pages/EditCourseForm')));
const DeleteCourseSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteCourseSearch')));
        //Academic Year
const AcademicYear = Loadable(lazy(() => import('pages/extra-pages/AcademicYear')));
const CreateAcademicYear = Loadable(lazy(() => import('pages/extra-pages/CreateAcademicYear')));
const EditAcademicYearSearch = Loadable(lazy(() => import('pages/extra-pages/EditAcademicYearSearch')));
const EditAcademicYearForm = Loadable(lazy(() => import('pages/extra-pages/EditAcademicYearForm')));
const DeleteAcademicYearSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteAcademicYearSearch')));
        //Grade
const Grade = Loadable(lazy(() => import('pages/extra-pages/Grade')));
const CreateGrade = Loadable(lazy(() => import('pages/extra-pages/CreateGrade')));
const EditGradeSearch = Loadable(lazy(() => import('pages/extra-pages/EditGradeSearch')));
const EditGradeForm = Loadable(lazy(() => import('pages/extra-pages/EditGradeForm')));
const DeleteGradeSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteGradeSearch')));
        //Term
const Term = Loadable(lazy(() => import('pages/extra-pages/Term')));
const CreateTerm = Loadable(lazy(() => import('pages/extra-pages/CreateTerm')));
const EditTermSearch = Loadable(lazy(() => import('pages/extra-pages/EditTermSearch')));
const EditTermForm = Loadable(lazy(() => import('pages/extra-pages/EditTermForm')));
const DeleteTermSearch = Loadable(lazy(() => import('pages/extra-pages/DeleteTermSearch')));

const TestManagement = Loadable(lazy(() => import('pages/extra-pages/TestManagement')));
const Tests = Loadable(lazy(() => import('pages/extra-pages/Tests')));
const CreateTest = Loadable(lazy(() => import('pages/extra-pages/CreateTest')));
const EditTestSearch = Loadable(lazy(() => import('pages/extra-pages/EditTestSearch')));
const EditTestForm = Loadable(lazy(() => import('pages/extra-pages/EditTestForm')));
const ViewTest = Loadable(lazy(() => import('pages/extra-pages/ViewTest')));
const ViewStudentTestSession = Loadable(lazy(() => import('pages/extra-pages/ViewStudentTestSession')));
//const StudentTestSession = Loadable(lazy(() => import('pages/extra-pages/StudentTestSession')));
const Questions = Loadable(lazy(() => import('pages/extra-pages/Questions')));
const CreateQuestion = Loadable(lazy(() => import('pages/extra-pages/CreateQuestion')));
const TestSessions = Loadable(lazy(() => import('pages/extra-pages/TestSessions')));
const StudentAnswers = Loadable(lazy(() => import('pages/extra-pages/StudentAnswers')));
//Teacher Dashboard
const TeacherTestManagement = Loadable(lazy(() => import('pages/extra-pages/staff_dashboard/test_management/TestManagement')));
//Student Dashboard
const StudentTest = Loadable(lazy(() => import('pages/extra-pages/StudentTest')));
const CourseTests = Loadable(lazy(() => import('pages/extra-pages/CourseTests')));
const TestSession = Loadable(lazy(() => import('pages/extra-pages/TestSession')));
const ResultsPage = Loadable(lazy(() => import('pages/extra-pages/ResultsPage')));
const StudentAssessmentAnalytics = Loadable(lazy(() => import('pages/extra-pages/StudentAssessmentAnalytics')));
//Other
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const CreateAdmin = Loadable(lazy(() => import('pages/extra-pages/CreateAdmin')));
const CreateStaff = Loadable(lazy(() => import('pages/extra-pages/CreateStaff')));
const CreateStudent = Loadable(lazy(() => import('pages/extra-pages/CreateStudent')));


const MainRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { path: '', element: <PrivateRoute component={DashboardDefault} /> },
      { path: 'color', element: <PrivateRoute component={Color} /> },
      { path: 'dashboard/default', element: <PrivateRoute component={DashboardDefault} /> },
      //School Admin Dashboard
              //User Mangement
      { path: 'user-management', element: <PrivateRoute component={UserManagement} userTypes={['school_admin']} /> },
                  //Admin
      { path: 'admin', element: <PrivateRoute component={Admin} /> },
      { path: 'edit-admin', element: <PrivateRoute component={EditAdminSearch} userTypes={['school_admin']} /> },
      { path: 'edit-admin/:id', element: <PrivateRoute component={EditAdminForm} userTypes={['school_admin']} /> },
      { path: 'delete-admin', element: <PrivateRoute component={DeleteAdminSearch} userTypes={['school_admin']} /> },
                  //Staff
      { path: 'staff', element: <PrivateRoute component={Staff} /> },
      { path: 'edit-staff', element: <PrivateRoute component={EditStaffSearch} userTypes={['school_admin']} /> },
      { path: 'edit-staff/:id', element: <PrivateRoute component={EditStaffForm} userTypes={['school_admin']} /> },
      { path: 'delete-staff', element: <PrivateRoute component={DeleteStaffSearch} userTypes={['school_admin']} /> },
                  //Student
      { path: 'student', element: <PrivateRoute component={Student} /> },
      { path: 'edit-student', element: <PrivateRoute component={EditStudentSearch} userTypes={['school_admin']} /> },
      { path: 'edit-student/:id', element: <PrivateRoute component={EditStudentForm} userTypes={['school_admin']} /> },
      { path: 'delete-student', element: <PrivateRoute component={DeleteStudentSearch} userTypes={['school_admin']} /> },
              //School Management
      { path: 'school-management', element: <PrivateRoute component={SchoolManagement} userTypes={['school_admin']} /> },
                  //College
      { path: 'college', element: <PrivateRoute component={College} /> },
      { path: 'create-college', element: <PrivateRoute component={CreateCollege} userTypes={['school_admin']} /> },
      { path: 'edit-college', element: <PrivateRoute component={EditCollegeSearch} userTypes={['school_admin']} /> },
      { path: 'edit-college/:id', element: <PrivateRoute component={EditCollegeForm} userTypes={['school_admin']} /> },
      { path: 'delete-college', element: <PrivateRoute component={DeleteCollegeSearch} userTypes={['school_admin']} /> },
                  //Faculty
      { path: 'faculty', element: <PrivateRoute component={Faculty} /> },
      { path: 'create-faculty', element: <PrivateRoute component={CreateFaculty} userTypes={['school_admin']} /> },
      { path: 'edit-faculty', element: <PrivateRoute component={EditFacultySearch} userTypes={['school_admin']} /> },
      { path: 'edit-faculty/:id', element: <PrivateRoute component={EditFacultyForm} userTypes={['school_admin']} /> },
      { path: 'delete-faculty', element: <PrivateRoute component={DeleteFacultySearch} userTypes={['school_admin']} /> },
                  //Programme
      { path: 'programme', element: <PrivateRoute component={Programme} /> },
      { path: 'create-programme', element: <PrivateRoute component={CreateProgramme} userTypes={['school_admin']} /> },
      { path: 'edit-programme', element: <PrivateRoute component={EditProgrammeSearch} userTypes={['school_admin']} /> },
      { path: 'edit-programme/:id', element: <PrivateRoute component={EditProgrammeForm} userTypes={['school_admin']} /> },
      { path: 'delete-programme', element: <PrivateRoute component={DeleteProgrammeSearch} userTypes={['school_admin']} /> },
                  //Course
      { path: 'course', element: <PrivateRoute component={Course} /> },
      { path: 'create-course', element: <PrivateRoute component={CreateCourse} userTypes={['school_admin']} /> },
      { path: 'edit-course', element: <PrivateRoute component={EditCourseSearch} userTypes={['school_admin']} /> },
      { path: 'edit-course/:id', element: <PrivateRoute component={EditCourseForm} userTypes={['school_admin']} /> },
      { path: 'delete-course', element: <PrivateRoute component={DeleteCourseSearch} userTypes={['school_admin']} /> },
                  //Academic Year
      { path: 'academic-year', element: <PrivateRoute component={AcademicYear} /> },
      { path: 'create-academic-year', element: <PrivateRoute component={CreateAcademicYear} userTypes={['school_admin']} /> },
      { path: 'edit-academicyear', element: <PrivateRoute component={EditAcademicYearSearch} userTypes={['school_admin']} /> },
      { path: 'edit-academicyear/:id', element: <PrivateRoute component={EditAcademicYearForm} userTypes={['school_admin']} /> },
      { path: 'delete-academicyear', element: <PrivateRoute component={DeleteAcademicYearSearch} userTypes={['school_admin']} /> },
                  //Grade
      { path: 'grade', element: <PrivateRoute component={Grade} /> },
      { path: 'create-grade', element: <PrivateRoute component={CreateGrade} userTypes={['school_admin']} /> },
      { path: 'edit-grade', element: <PrivateRoute component={EditGradeSearch} userTypes={['school_admin']} /> },
      { path: 'edit-grade/:id', element: <PrivateRoute component={EditGradeForm} userTypes={['school_admin']} /> },
      { path: 'delete-grade', element: <PrivateRoute component={DeleteGradeSearch} userTypes={['school_admin']} /> },

                  //Term
      { path: 'term', element: <PrivateRoute component={Term} /> },
      { path: 'create-term', element: <PrivateRoute component={CreateTerm} userTypes={['school_admin']} /> },
      { path: 'edit-term', element: <PrivateRoute component={EditTermSearch} userTypes={['school_admin']} /> },
      { path: 'edit-term/:id', element: <PrivateRoute component={EditTermForm} userTypes={['school_admin']} /> },
      { path: 'delete-term', element: <PrivateRoute component={DeleteTermSearch} userTypes={['school_admin']} /> },
              //Test Management
      { path: 'test-management', element: <PrivateRoute component={TestManagement} userTypes={['school_admin']} /> },
      { path: 'tests', element: <PrivateRoute component={Tests} /> },
      { path: 'create-test', element: <PrivateRoute component={CreateTest} userTypes={['school_admin']} /> },
      { path: 'edit-test', element: <PrivateRoute component={EditTestSearch} userTypes={['school_admin']} /> },
      { path: 'edit-test/:id', element: <PrivateRoute component={EditTestForm} userTypes={['school_admin']} /> },
      { path: 'view-test', element: <PrivateRoute component={ViewTest} userTypes={['school_admin']} /> },
      { path: 'view-test-sessions/:testId', element: <PrivateRoute component={ViewStudentTestSession} userTypes={['school_admin']} /> },

      //{ path: 'student-test-sessions/:testId', element: <PrivateRoute component={StudentTestSession} userTypes={['school_admin']} /> },
      { path: 'questions', element: <PrivateRoute component={Questions} /> },
      { path: 'create-question', element: <PrivateRoute component={CreateQuestion} userTypes={['school_admin']} /> },
      { path: 'test-sessions', element: <PrivateRoute component={TestSessions} /> },
      { path: 'student-answers', element: <PrivateRoute component={StudentAnswers} /> },
      //Teacher Dashboard
              //Test Management
      { path: 'teacher-test-management', element: <PrivateRoute component={TeacherTestManagement} userTypes={['teacher']} /> },
      //Student Dashboard
              //Test
      { path: 'student-test', element: <PrivateRoute component={StudentTest} userTypes={['student']} /> },
      { path: 'courses/:courseId/tests', element: <PrivateRoute component={CourseTests} userTypes={['student']} /> },
      { path: 'test-session/:testId', element: <PrivateRoute component={TestSession} userTypes={['student']} /> },
      { path: 'results/:test_session_id', element: <PrivateRoute component={ResultsPage} userTypes={['student']} /> },
      { path: 'student-assessment-analytics', element: <PrivateRoute component={StudentAssessmentAnalytics} userTypes={['student']} /> },
      //Other
      { path: 'sample-page', element: <PrivateRoute component={SamplePage} /> },
      { path: 'create-admin', element: <PrivateRoute component={CreateAdmin} userTypes={['school_admin']} /> },
      { path: 'create-staff', element: <PrivateRoute component={CreateStaff} userTypes={['school_admin']} /> },
      { path: 'create-student', element: <PrivateRoute component={CreateStudent} userTypes={['school_admin']} /> },
      { path: 'shadow', element: <PrivateRoute component={Shadow} /> },
      { path: 'typography', element: <PrivateRoute component={Typography} /> }

    ]
  }
];

export default MainRoutes;
