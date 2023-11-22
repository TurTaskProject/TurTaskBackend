import { FloatingParticles } from "../FlaotingParticles";

export function LandingPage() {
  return (
    <div>
      {/* Particles Container */}
      <FloatingParticles />
      {/* Navbar */}
      <div className="navbar bg-white z-10">
        <div className="navbar-end space-x-3 z-10"></div>
      </div>
      <div className="relative" id="home">
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="relative pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-#143D6C font-bold text-5xl md:text-6xl xl:text-7xl">
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
              <p className="mt-8 text-#143D6C">Unleash productivity with our personal task and project management.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <a
                  href="/login"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max">
                  <span className="relative text-base font-semibold text-white">Get started</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
