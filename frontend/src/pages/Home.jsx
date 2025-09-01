import useFCMToken from "../hooks/useFCMToken";

const Home = () => {

  useFCMToken("user");
  
  return <div>Home</div>;
};

export default Home;
