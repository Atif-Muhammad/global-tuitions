import axios from "axios";

const baseUrl = "http://51.24.30.180:3000/api";
axios.defaults.withCredentials = true;

// get enabled categories
const get_enabled_categories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/categories/enabled`, {
      params: { order: 1 },
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
// get enabled courses
const get_enabled_courses = async () => {
  try {
    const response = await axios.get(`${baseUrl}/courses/enabled`, {
      params: { order: 1 },
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
// get enabled popular courses
const get_enabled_popular_courses = async () => {
  try {
    const response = await axios.get(`${baseUrl}/courses/enabled/popular`, {
      params: { order: 1 },
    });
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
// get enabled course contents
const get_enabled_contents = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/courses/course/enabled/content`,
      { params: { id: id } }
    );
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const postInq = async (data) => {
  // console.log(data)
  try {
    const response = await axios.post(`${baseUrl}/inquiries/postInquiry`, {
      data,
    }, {withCredentials: true});
    console.log(response.data);
    if (response.data === "OK") {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const postEnrollment = async (data) => {
  
  try {
    const response = await axios.post(
      `${baseUrl}/enrollments/enroll`,
      {
        data,
      },
      { withCredentials: true }
    );
    // console.log(response);
    if (response.statusText === "OK") {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const subscribe = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/subscription/subscribe`, {
      data,
    }, {withCredentials: true});
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const unSubscribe = async (data) => {};

const signup = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/student/signup`, { data }, { withCredentials: true });
    return response;
  } catch (error) {
    return error;
  }
};

const signin = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl}/student/signin`,
      { data },
      { withCredentials: true }
    );
    // console.log(response);
    return response;
  } catch (error) {
    return error;
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      `${baseUrl}/student/logout`,
      {},
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    return error;
  }
};

const checkSession = async () => {
  try {
    const response = await axios.get(`${baseUrl}/checkSession`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    return error;
  }
};

const getUserInfo = async ()=>{
  try {
    const response = await axios.get(`${baseUrl}/student/profile`, {withCredentials: true})
    if(response.status === 200){
      return response
    }
  } catch (error) {
    return error
  }
}

const postFeedBack = async(data)=>{
  try {
    const response = await axios.post(`${baseUrl}/student/feedBack`, {data}, {withCredentials: true})
    return response
  } catch (error) {
    return error
  }
}
const getQuestions = async ()=>{
  try {
    
    const response = await axios.get(`${baseUrl}/student/questions`, {withCredentials: true}) 
    // console.log(response)
    return response
  } catch (error) {
    return error;
  }
  
}

const sendUserCode = async (email)=>{
  try {
    const response = await axios.post(`${baseUrl}/student/sendCode`,{email}, {withCredentials: true})
    return response
  } catch (error) {
    return error
  }
}

const checkCode = async (code)=>{
  try {
    const response = await axios.post(`${baseUrl}/student/confirmCode`, {code}, {withCredentials: true})
    return response
  } catch (error) {
    return error
  }
}

const changePassword = async (password)=>{
  try {
    const response = await axios.put(`${baseUrl}/student/changePass`, {password}, {withCredentials: true})
    return response
  } catch (error) {
    return error
  }
}

const changeUserName = async (name)=>{
  try {
    const response = await axios.put(`${baseUrl}/student/changeName`, {name}, {withCredentials: true})
    return response
  } catch (error) {
    return error
  }
}

const getOffers = async ()=>{
  try {
    const response = await axios.get(`${baseUrl}/offers/getEnabledOffers`);
   
    return response
  } catch (error) {
    return error
  }
}

const APIS = {
  // categories
  get_enabled_categories,

  // courses
  get_enabled_courses,
  get_enabled_popular_courses,

  // course_contents
  get_enabled_contents,

  // inquiries
  postInq,

  // enrollment
  postEnrollment,
  signup,
  signin,
  logout,
  checkSession,
  subscribe,
  unSubscribe,
  getUserInfo,
  postFeedBack,
  getQuestions,
  sendUserCode,
  checkCode,
  changePassword,
  changeUserName,
  getOffers
};

export default APIS;
