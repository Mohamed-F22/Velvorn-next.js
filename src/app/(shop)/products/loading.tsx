export default function Loading() {
  return (
    <>
      <style>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
          background-color: #ffffff;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }

        .loader {
          display: block;
          width: 84px;
          height: 84px;
          position: relative;
        }

        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #222;
          transform: translate(-50%, -100%) scale(0);
          animation: push_401 2s infinite linear;
        }

        .loader:after {
          animation-delay: 1s;
        }
      `}</style>

      <div className="loader-container">
        <span className="loader"></span>
      </div>
    </>
  );
}
