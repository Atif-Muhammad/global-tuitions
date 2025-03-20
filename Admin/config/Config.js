import { data } from "autoprefixer";
import axios from "axios";

// const BASE_URL = "https://globaltuitions.co.uk/api";
// axios.defaults.withCredentials = true;

const BASE_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

const API_URLS = {
  // Catagory API's
  categories: `${BASE_URL}/categories/admin`,
  categories_enabled: `${BASE_URL}/categories/admin/enabled`,
  Post_category: `${BASE_URL}/categories/admin/addCategory`,
  Put_category: `${BASE_URL}/categories/admin/category/update`,
  Delete_category: `${BASE_URL}/categories/admin/category/delCategory`,

  // Courses API's
  Courses: `${BASE_URL}/courses/admin`,
  course_details: `${BASE_URL}/courses/admin/course/courseDetails`,
  Course_Popular: `${BASE_URL}/courses/admin/course/update/popular`,
  Post_Course: `${BASE_URL}/courses/admin/addCourse`,
  Put_Course: `${BASE_URL}/courses/admin/course/update`,
  Delete_Course: `${BASE_URL}/courses/admin/course/delCourse`,
  Course_Description_update: `${BASE_URL}/courses/admin/course/detailsupdate`,

  // Inqueries API's
  Course_Inqueries: `${BASE_URL}/inquiries/admin/course`,
  General_Inqueries: `${BASE_URL}/inquiries/admin/general`,
  Specific_Course_Inqueries: `${BASE_URL}/inquiries/admin/course/specific`,
  Inqueries_view: `${BASE_URL}/inquiries/admin/inquiry/updateViewed`,
  Inqueries_reply: `${BASE_URL}/inquiries/admin/inquiry/reply`,
  Inqueries_Update: `${BASE_URL}/inquiries/admin/inquiry/updateReplied`,
  Put_Course: `${BASE_URL}/courses/admin/course/update`,
  Delete_Course: `${BASE_URL}/courses/admin/course/delCourse`,

  // Enrollment API's use in Enviroment component
  Enrollment: `${BASE_URL}/enrollments/admin`,
};
// export default API_URLS;

// get all categories
const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/admin`, {
      params: { order: 1 },
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// get free category
const getFreeCategory = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/categories/admin/freeCategory`,
      {
        params: { order: 1 },
        withCredentials: true,
      }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// get all courses
const getAllCourses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/admin`, {
      params: { order: 1 },
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const getCourseDets = async (id)=>{
  console.log(id)
  try {
    const response = axios.get(`${BASE_URL}/courses/admin/courseDetails?course=${id}`, {withCredentials: true});
    return response
  } catch (error) {
    return error
  }

}

const delFreeCourse = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/freeCourses/admin/delFreeCourse`,
      {
        params: { id: id },
        withCredentials: true,
      }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// update category
const updateCategory = async (data) => {
  // console.log(data);
  try {
    const response = await axios.put(
      `${BASE_URL}/categories/admin/category/update`,
      { data },
      { withCredentials: true }
    );
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

// delete category
const RemoveCategory = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/categories/admin/category/removeCategory`,
      { id },
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/categories/admin/category/delCategory`,
      {
        params: { id },
        withCredentials: true,
      }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const recoverCategory = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/categories/admin/category/recover`,
      { id },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const getDeletedCategories = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/categories/admin/deletedCategories`,
      { withCredentials: true }
    );
    if (response.status === 200) {
      // console.log(response)
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// add category
const addCategory = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/categories/admin/addCategory`,
      { data },
      { withCredentials: true }
    );
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

// set course as popular
const setPopular = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/courses/admin/course/update/popular`,
      { id },
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// update course
const updateCourse = async (data) => {
  // console.log(data);
  try {
    const response = await axios.put(
      `${BASE_URL}/courses/admin/course/update`,
      { data },
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      return response;
    }
  } catch (error) {
    return error;
  }
};

// add course
const addCourse = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/courses/admin/addCourse`,
      { data },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    return error;
  }
};

// update course details
const updateCourseDetails = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/courses/admin/course/detailsupdate`,
      { data },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    return error;
  }
};

const getDeletedCourses = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/courses/admin/getDelCourses`,
      {
        params: { order: 1 },
        withCredentials: true,
      }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// delete course
const delCourse = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/courses/admin/course/delCourse`,
      {
        params: { id },
        withCredentials: true,
      }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const RemoveCourse = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/courses/admin/course/remCourse`,
      { id },
      {
        withCredentials: true,
      }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const recoverCourse = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/courses/admin/course/recover`,
      { id },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

// get general inquiries
const getGenInqs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/inquiries/admin/general`, {
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// get course inquiries
const courseInq = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/inquiries/admin/course`, {
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// handle inq view
const inqView = async (id) => {
  // console.log(id)
  try {
    await axios.put(
      `${BASE_URL}/inquiries/admin/inquiry/updateViewed`,
      { id },
      { withCredentials: true }
    );
  } catch (error) {
    return error;
  }
};

// handle inq reply
const inqReply = async (data) => {
  try {
    const response1 = await axios.post(
      `${BASE_URL}/inquiries/admin/inquiry/reply`,
      { data },
      { withCredentials: true }
    );
    if (response1.statusText === "OK") {
      const id = data.inq._id;
      const response2 = await axios.put(
        `${BASE_URL}/inquiries/admin/inquiry/updateReplied`,
        { id },
        { withCredentials: true }
      );
      if (response2.statusText === "OK") {
        return response2.data;
      }
    }
  } catch (error) {
    return error;
  }
};

const enrollmentReply = async (data) => {
  try {
    const response = axios.post(
      `${BASE_URL}/enrollments/admin/enrollmentReply`,
      { data },
      { withCredentials: true }
    );
    if (response === 200) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const enrollmentApprove = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/enrollments/admin/approval`,
      { id },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    return error;
  }
};
const enrollmentReject = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/enrollments/admin/rejection`,
      { id },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

// get all enrollments
const getEnrollments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/enrollments/admin`, {
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

// get course enrollment
const getCourseEnrollments = async (id) => {
  // console.log(id)
  try {
    const response = await axios.get(`${BASE_URL}/enrollments/admin/course/enrollments`, {params: {id: id}, withCredentials: true});
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const getAllCourseInqs = async (payload) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/admin/course`,
      { payload },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
const getCourseInqs = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/admin/course/specific`,
      { params: { id }, withCredentials: true }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const getSubscribers = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/subscription/admin/subscribers`,
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const sendMsgToSubs = async (payload)=>{
  try {
    const response = await axios.post(`${BASE_URL}/subscription/admin/reply`, {payload}, {withCredentials: true});
    if(response.status === 200){
      return response
    }
  } catch (error) {
    return error
  }
}

const dashboard = async ()=>{
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/admin`, {withCredentials: true});
    if(response.status === 200){
      return response
    }
  } catch (error) {
    return error
  }
}

const addOffer = async (data)=>{
  try {
    const response = await axios.post(`${BASE_URL}/offers/admin/postOffer`, {data}, {withCredentials: true});
    return response
  } catch (error) {
    return error
  }
}

const getOffers = async ()=>{
  try {
    const response = await axios.get(`${BASE_URL}/offers/admin/getOffers`, {withCredentials: true});
    return response
  } catch (error) {
    return error
  }
}

const editOffer = async (data)=>{
  try {
    const response = await axios.put(`${BASE_URL}/offers/admin/editOffer`, {data}, {withCredentials: true});
    return response
  } catch (error) {
    return error
  }
}

const APIs = {
  // get all categories
  getAllCategories,
  // get all courses
  getAllCourses,
  getCourseDets,
  // set pupular course
  setPopular,
  // update category
  updateCategory,
  // update course
  updateCourse,
  // delete category
  deleteCategory,
  // add category
  addCategory,
  // update course details
  updateCourseDetails,
  // add course
  addCourse,
  // delete course
  delCourse,
  // get gen inquiries
  getGenInqs,
  // get course inquiries
  courseInq,
  // handle inq view
  inqView,
  // handle inq reply
  inqReply,
  // get all enrollments
  getEnrollments,
  // get course enrollment
  getCourseEnrollments,

  getCourseInqs,
  getAllCourseInqs,
  getFreeCategory,
  delFreeCourse,
  getSubscribers,
  enrollmentReply,
  enrollmentApprove,
  enrollmentReject,
  getDeletedCategories,
  getDeletedCourses,
  RemoveCategory,
  recoverCategory,
  RemoveCourse,
  recoverCourse,
  sendMsgToSubs,
  dashboard,
  addOffer,
  getOffers,
  editOffer
};

export default APIs;
