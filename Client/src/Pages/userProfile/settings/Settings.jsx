import { useState, useEffect } from "react";
import Config from "../../../../Config/Config";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showSendCodeModal, setShowSendCodeModal] = useState(false);
  const [showSendCodeUsernameModal, setShowSendCodeUsernameModal] =
    useState(false);
  const [showConfirmationCodeModal, setShowConfirmationCodeModal] =
    useState(false);
  const [
    showConfirmationCodeUsernameModal,
    setShowConfirmationCodeUsernameModal,
  ] = useState(false);
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [username, setUsername] = useState("");

  const getDetails = async () => {
    Config.getUserInfo()
      .then((res) => {
        setUserInfo(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch data. Please try again later.");
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleSendCode = () => {
    Config.sendUserCode(userInfo.email)
      .then((res) => {
        if (res.status === 200) {
          setShowSendCodeModal(false);
          setShowConfirmationCodeModal(true);
          toast.success("Confirmation code  send on your email.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendCodeUsername = () => {
    Config.sendUserCode(userInfo.email)
      .then((res) => {
        if (res.status === 200) {
          setShowSendCodeUsernameModal(false);
          setShowConfirmationCodeUsernameModal(true);
          toast.success("Confirmation code  send on your email.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmCodePassword = () => {
    Config.checkCode(confirmationCode)
      .then((res) => {
        if (res.status === 200) {
          setShowConfirmationCodeModal(false);
          setShowPasswordModal(true);
        } else {
          toast.error("Confirmation code is invalid");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmCodeUsername = () => {
    Config.checkCode(confirmationCode)
      .then((res) => {
        if (res.status === 200) {
          setShowConfirmationCodeUsernameModal(false);
          setShowUsernameModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSavePassword = (values, { setSubmitting }) => {
    Config.changePassword(values.password)
      .then((res) => {
        if (res.status === 200) {
          setShowPasswordModal(false);
          setSubmitting(false);
          toast.success("Password changed successfully!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveUsername = (e) => {
    e.preventDefault();
    Config.changeUserName(username)
      .then((res) => {
        if (res.status === 200) {
          setShowUsernameModal(false);
          toast.success("Username changed successfully!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteAccount = () => {
    toast.success("Account deleted successfully.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-urbanist p-6 bg-gray-50">
      <ToastContainer />
      <h2 className="text-3xl font-semibold mb-8">Account Settings</h2>

      {/* Change Password Section */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-md">
        <p className="text-xl font-semibold">Change Password</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          onClick={() => setShowSendCodeModal(true)}
        >
          Change
        </button>
      </div>

      {/* Change Username Section */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-md">
        <p className="text-xl font-semibold">Change Username</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          onClick={() => setShowSendCodeUsernameModal(true)}
        >
          Change
        </button>
      </div>

      {/* Delete Account Section */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-md">
        <p className="text-xl font-semibold text-red-600">Delete Account</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
          onClick={handleDeleteAccount}
        >
          Delete
        </button>
      </div>

      {/* Send Code Modal for Password Change */}
      {showSendCodeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Send Confirmation Code</h3>
            <p className="mb-4">
              By clicking the following button, a confirmation code will be sent
              to your email <strong>"{userInfo.email}"</strong>
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSendCodeModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCode}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
              >
                Send Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Code Modal for Username Change */}
      {showSendCodeUsernameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Send Confirmation Code</h3>
            <p className="mb-4">
              By clicking the following button, a confirmation code will be sent
              to your email<strong>"{userInfo.email}"</strong>.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSendCodeUsernameModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCodeUsername}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
              >
                Send Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Code Modal for Password Change */}
      {showConfirmationCodeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Enter Confirmation Code</h3>
            <p className="mb-4">
              A confirmation code has been sent to your email{" "}
              <strong>"{userInfo.email}"</strong>. Please enter the code below
              to proceed with changing your password.
            </p>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmationCodeModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCodePassword}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
              >
                Confirm Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Code Modal for Username Change */}
      {showConfirmationCodeUsernameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Enter Confirmation Code</h3>
            <p className="mb-4">
              A confirmation code has been sent to your email{" "}
              <strong>"{userInfo.email}"</strong>. Please enter the code below
              to proceed with changing your username.
            </p>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmationCodeUsernameModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCodeUsername}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
              >
                Confirm Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Change Password</h3>
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={passwordValidationSchema}
              onSubmit={handleSavePassword}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordPopup(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      {isSubmitting ? "Submitting..." : "Save"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Change Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Change Username</h3>
            <form onSubmit={handleSaveUsername}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  New Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowUsernameModal(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
