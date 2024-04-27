import "./styles/Header.css";

interface Props {
  onClickDarkMode: Function;
}

const Header = ({ onClickDarkMode }: Props) => {
  return (
    <div id="header">
      <a href="https://delta-type.netlify.app">
        Delta Type
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-cursor-text"
          viewBox="0 0 16 16"
        >
          <path d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.17 4.17 0 0 1 10.5 1.5a.5.5 0 0 1 0 1c-.638 0-1.177.213-1.564.434a3.5 3.5 0 0 0-.436.294V7.5H9a.5.5 0 0 1 0 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 0 1 0 1 4.17 4.17 0 0 1-2.06-.566A5 5 0 0 1 8 13.65a5 5 0 0 1-.44.285 4.17 4.17 0 0 1-2.06.566.5.5 0 0 1 0-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 0 1 0-1h.5V3.228a3.5 3.5 0 0 0-.436-.294A3.17 3.17 0 0 0 5.5 2.5.5.5 0 0 1 5 2m2.648 10.645" />
        </svg>
      </a>
      <svg
        id="dark-mode-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-circle-half"
        viewBox="0 0 16 16"
        onClick={() => onClickDarkMode()}
      >
        <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
      </svg>
    </div>
  );
};

export default Header;
