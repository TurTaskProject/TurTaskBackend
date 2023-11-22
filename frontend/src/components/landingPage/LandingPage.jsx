import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export function LandingPage() {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);
  return (
    <div className="bg-black">
      {/* Particles Container */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100vh",
          zIndex: 0,
          backgroundColor: "black",
        }}
      >
        <Particles
          id="particles"
          init={particlesInit}
          loaded={particlesLoaded}
          className="-z-10"
          options={{
            fpsLimit: 240,
            smooth: true,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#4f46e5",
              },
              links: {
                color: "#818cf8",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 100,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "square",
              },
              size: {
                value: { min: 4, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
      {/* Navbar */}
      <div className="navbar bg-white z-10">
        <div className="navbar-start z-10">
          <a className="btn btn-ghost text-xl z-10 text-white">TurTask</a>
        </div>
        <div className="navbar-end space-x-3 pr-2 z-10">
          <a className="btn z-10" href="/login">
            Login
          </a>
          <a className="btn z-10" href="/signup">
            Sign Up
          </a>
        </div>
      </div>
      <div className="relative" id="home">
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="relative pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-gray-100 font-bold text-5xl md:text-6xl xl:text-7xl">
                Manage your task with{" "}
                <span className="text-primary">
                  TurTask
                  <label className="swap swap-flip text-6xl">
                    <input type="checkbox" />
                    <div className="swap-on">😇</div>
                    <div className="swap-off">🥳</div>
                  </label>
                </span>
              </h1>
              <p className="mt-8 text-gray-400">
                Unleash productivity with our all-in-one task and project
                management solution. Streamline your workflow, automate tasks,
                and conquer projects effortlessly.
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <a
                  href="/login"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                >
                  <span className="relative text-base font-semibold text-white">
                    Get started
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
