import CreateItem from "../components/CreateItem";
import Reset from "../components/Reset";

const Sell = props => {
  return (
    <div>
      <p>Reset Your Password</p>
      <Reset resetToken={props.query.resetToken} />
    </div>
  );
};

export default Sell;
