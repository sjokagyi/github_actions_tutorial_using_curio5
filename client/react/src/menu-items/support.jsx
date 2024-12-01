// src/menu-items/support.jsx

// assets
import { ChromeOutlined, QuestionOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const icons = {
    ChromeOutlined,
    QuestionOutlined,
    TeamOutlined,
    UserOutlined
};

const support = {
    id: 'support',
    title: 'Support',
    type: 'group',
    children: [
        {

            //School Admin Dashboard

            id: 'user-management',
            title: 'User Management',
            type: 'item',
            url: '/dashboard/user-management',
            icon: icons.BookOutlined,
            userTypes: ['school_admin']
        },
        {
            id: 'school-management',
            title: 'School Management',
            type: 'item',
            url: '/dashboard/school-management',
            icon: icons.BookOutlined,
            userTypes: ['school_admin']
        },
        {
            id: 'test-management',
            title: 'Test Management',
            type: 'item',
            url: '/dashboard/test-management',
            icon: icons.BookOutlined,
            userTypes: ['school_admin']
        },
        {
            id: 'assessment-analytics',
            title: 'Assessment Analytics',
            type: 'item',
            url: '/dashboard/assessment-analytics',
            icon: icons.BookOutlined,
            userTypes: ['school_admin']
        },
        {
            id: 'test',
            title: 'Take a Test',
            type: 'item',
            url: '/dashboard/student-test',
            icon: icons.BookOutlined,
            userTypes: ['student']
        },
        {
            id: 'assessment-analytics',
            title: 'Assessment Analytics',
            type: 'item',
            url: '/dashboard/student-assessment-analytics',
            icon: icons.BookOutlined,
            userTypes: ['student']
        },

        //Teacher Dashboard

        {
            id: 'teacher-test-management',
            title: 'Test Management',
            type: 'item',
            url: '/dashboard/teacher-test-management',
            icon: icons.BookOutlined,
            userTypes: ['teacher']
        },
        {
            id: 'teacher-assessment-analytics',
            title: 'Assessment Analytics',
            type: 'item',
            url: '/dashboard/teacher-assessment-analytics',
            icon: icons.BookOutlined,
            userTypes: ['teacher']
        }

        //Other

        //{
        //    id: 'sample-page',
        //    title: 'Sample Page',
        //    type: 'item',
        //    url: '/dashboard/sample-page',
        //    icon: icons.ChromeOutlined
        //},
        //{
        //    id: 'create-staff',
        //    title: 'Create Staff',
        //   type: 'item',
        //    url: '/dashboard/create-staff',
        //    icon: icons.TeamOutlined,
        //    userTypes: ['school_admin']
        //},
        //{
        //    id: 'create-admin',
        //    title: 'Create Admin',
        //    type: 'item',
        //    url: '/dashboard/create-admin',
        //    icon: icons.UserOutlined,
        //    userTypes: ['school_admin']
        //},
        //{
        //    id: 'create-student',
        //    title: 'Create Student',
        //    type: 'item',
        //    url: '/dashboard/create-student',
        //    icon: icons.UserOutlined,
        //    userTypes: ['school_admin']
        //},
        //{
        //    id: 'documentation',
        //    title: 'Documentation',
        //    type: 'item',
        //    url: 'https://codedthemes.gitbook.io/mantis/',
        //    icon: icons.QuestionOutlined,
        //    external: true,
        //    target: true
        //}
    ]
};

export default support;
