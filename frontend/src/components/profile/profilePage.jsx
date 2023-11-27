import { ProfileUpdateComponent } from "./ProfileUpdateComponent";
import { axiosInstance } from "src/api/AxiosConfig";
import { useEffect, useState } from "react";

export function ProfileUpdatePage() {
  const [profile_pic, setProfilePic] = useState(undefined);
  const [about, setAbout] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/data/");
        const fetchedProfilePic = response.data.profile_pic;
        const fetchedAbout = response.data.about;
        setProfilePic(fetchedProfilePic);
        setAbout(fetchedAbout);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      <div className="stats shadow mt-3">
        <div className="stat">
          <div className="stat-title truncate">Firstname</div>
          <div className="stat-value truncate">Sirin</div>
          {/* <div className="stat-desc truncate">User ID</div> */}
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-20 rounded-full">
                <img src={profile_pic} alt="Profile Picture" />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="stat">
          <div className="stat-title">Health</div>
          <div className="stat-value flex truncate">
            234/3213
            <div className="stat-figure text-secondary px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0"></path>
              </svg>
            </div>
          </div>
          <div className="stat-desc py-2">32% Remain</div>
          <progress
            className="progress progress-error w-56"
            value={20}
            max="100"
          ></progress>
        </div> */}
{/* 
        <div className="stat">
          <div className="stat-title truncate">Level</div>
          <div className="stat-value flex">
            1
            <div className="stat-figure text-secondary px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#3abff8"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div className="stat-desc py-2">3213/321312321 points</div>
          <progress
            className="progress progress-info w-36"
            value="10"
            max="100"
          ></progress>
        </div>

        <div className="stat">
          <div className="stat-title">Gold</div>
          <div className="stat-value flex truncate">
            331412421
            <div className="stat-figure text-secondary px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke="gold"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
            </div>
          </div>
          <div className="stat-desc py-2">Top 12% of Global Ranking</div>
          <progress
            className="progress progress-warning w-56"
            value={20}
            max="100"
          ></progress>
        </div> */}
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">About me</h2>
          <div className="card-actions justify-end"></div>
          <textarea
            className="textarea textarea-bordered textarea-lg w-full"
            disabled
        placeholder="Enter your about me"
      >
            {about}
          </textarea>
      
        </div>
      </div>

      {/* <div className="grid grid-cols-2 grid-rows-2 gap-4 my-2">
        <div className="col-span-full">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Overall Statistics</h2>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
        </div>
        <div className="col-start-2 row-start-2">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Achievements</h2>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
        </div>
        <div className="col-start-1 row-start-2">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Friends</h2>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="fixed bottom-4 right-4">
        <ul className="menu menu-horizontal bg-base-200 rounded-box">
          <li>
            <a
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 16 16"
                stroke="currentColor"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
              <p className="text-xl font-bold">Edit</p>
            </a>
          </li>
        </ul>
      </div>

      {/* Modal */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl flex flex-col">
          <form method="dialog">
            <ProfileUpdateComponent />
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
