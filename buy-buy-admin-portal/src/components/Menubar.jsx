import logo from "/src/assets/logo12.png";
import logout from "/src/assets/logout.svg";

export default function Menubar({ setActiveTab }) {
  const handleTab = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="menubar">
      <img className="logo" src={logo} alt="" />

      <button onClick={() => handleTab("manage")}>MANAGE PRODUCTS</button>
      <button onClick={() => handleTab("add")}>ADD NEW PRODUCT</button>

      <div className="logout_div">
        <div className="logout_subdiv1">
          <img src={logout} alt="" />
        </div>
        <div>
          <span className="logout_span">
            <i>Logout</i>
          </span>
        </div>
      </div>
    </div>
  );
}
