import { useParams } from "react-router-dom";
import "./styles.css";

function Details() {
  const { id } = useParams();
  console.log(id);

  return (
    <div className="main">
      <h1>details</h1>
      <h1>{id}</h1>
    </div>
  );
}

export default Details;