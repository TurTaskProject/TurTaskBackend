import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

function Signup() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-4xl font-semibold mb-6">Create your account</h1>
        <p className="text-gray-700 mb-6 text-lg">Start spending more time on your own table.</p>
        <div className="font-bold">
          <div className="mb-4">
            <button className="flex items-center justify-center bg-blue-500 text-white px-14 py-3 rounded-lg">
              <span className="mr-3">
                <FontAwesomeIcon icon={faGoogle} />
              </span>
              Sign Up with Google
            </button>
          </div>

          <div className="mb-4">
            <button className="flex items-center justify-center bg-gray-800 text-white px-14 py-3 rounded-lg">
              <span className="mr-3">
                <FontAwesomeIcon icon={faGithub} />
              </span>
              Sign Up with Github
            </button>
          </div>

          <div>
            <button className="bg-green-500 text-white px-14 py-3 rounded-lg">Sign Up with your email.</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
