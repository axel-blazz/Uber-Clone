
import useFCMToken from "../hooks/useFCMToken";



const CaptainHome = () => {
  // keep your function outside
  useFCMToken("captain");
  return <div>CaptainHome</div>;
};

export default CaptainHome;
