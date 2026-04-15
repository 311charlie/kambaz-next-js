import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};
export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};
export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/modules`, module);
  return data;
};
export const deleteModule = async (courseId: string, moduleId: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
  return data;
};
export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};
export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};
export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return data;
};
export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};
export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return data;
};
export const enrollInCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses/enroll`, { courseId });
  return data;
};
export const unenrollFromCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(`${USERS_API}/current/courses/unenroll`, { data: { courseId } });
  return data;
};
export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};
export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return data;
};
export const findQuizById = async (quizId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/${quizId}`);
  return data;
};
export const createQuiz = async (courseId: string, quiz: any) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return data;
};
export const updateQuiz = async (quiz: any) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return data;
};
export const deleteQuiz = async (quizId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};
export const addQuestion = async (quizId: string, question: any) => {
  const { data } = await axios.post(`${QUIZZES_API}/${quizId}/questions`, question);
  return data;
};
export const updateQuestion = async (quizId: string, question: any) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quizId}/questions/${question._id}`, question);
  return data;
};
export const deleteQuestion = async (quizId: string, questionId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/${quizId}/questions/${questionId}`);
  return data;
};
export const getMyAttempts = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
  return data;
};
export const getLatestAttempt = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/latest`);
  return data;
};
export const submitAttempt = async (quizId: string, answers: any[]) => {
  const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`, { answers });
  return data;
};