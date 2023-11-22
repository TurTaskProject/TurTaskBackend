import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen  bg-gray-100 items-center">
      <div className="bg-black text-white p-4 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">TurTask</h1>
          <div className="space-x-4">
            <a
              href="\signup"
              className="text-gray-300 hover:text-white border-b-2 border-transparent hover:border-white px-4 py-2 transition duration-300 font-bold">
              Register
            </a>
            <a
              href="\login"
              className="text-gray-300 hover:text-white border-b-2 border-transparent hover:border-white px-4 py-2 transition duration-300 font-bold">
              Login
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex-grow p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="grid grid-rows-3">
            <div className="text-center">
              <img
                src="https://img.freepik.com/vektoren-kostenlos/niedlich-schildkroete-meditation-yoga-karikatur-vektor-symbol-illustration-tier-sport-symbol-begriff-freigestellt_138676-6833.jpg"
                alt="Your Picture"
                className="rounded-full w-52 h-52 mx-auto mb-4"
              />
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-bold mb-6">TurTask</h1>
              <p className="text-5xl font-bold mb-6">Your Ultimate Task Management</p>
            </div>
            <div className="text-left">
              <p className="text-gray-700 text-xl font-bold">
                TurTask is a task and project management tool that incorporates gamification elements.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="bg-white p-10 rounded-lg shadow-md w-full md:w-96 lg:w-1/2">
              <h1 className="text-4xl font-semibold mb-6">Create your account</h1>
              <p className="text-gray-700 mb-6 text-lg">Start spending more time on your own table.</p>
              <div className="font-bold">
                <div className="mb-4">
                  <button className="flex items-center justify-center bg-blue-500 text-white px-10 py-3 rounded-lg">
                    <span className="mr-3">
                      <FontAwesomeIcon icon={faGoogle} />
                    </span>
                    Sign Up with Google
                  </button>
                </div>
                <div className="mb-4">
                  <button className="flex items-center justify-center bg-gray-800 text-white px-10 py-3 rounded-lg">
                    <span className="mr-3">
                      <FontAwesomeIcon icon={faGithub} />
                    </span>
                    Sign Up with Github
                  </button>
                </div>
                <div>
                  <button className="bg-green-500 text-white px-10 py-3 rounded-lg">Sign Up with your email.</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
