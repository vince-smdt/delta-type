import "./styles/RestartButton.css";

interface Props {
  onClick: Function;
}

const RestartButton = ({ onClick }: Props) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div id="restart-button" onClick={handleClick}>
      Restart Test
    </div>
  );
};

export default RestartButton;
