/* import "./sideMenu.css"
import { AiOutlineMenu } from "react-icons/ai"
import { useState } from "react";

const SideMenu = () => {

    const [isHover, setIsHover] = useState(false);

    return (
        <div className="sidebar" onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
            <div style={{ padding: "10px" }}>
                <AiOutlineMenu color="white" /> Menu
            </div>
            {isHover &&
                <div className="listContainer">
                    <div>Pesquisa</div>
                    <div>Apagar livro</div>
                    <div>Criar livro</div>
                    <div>Alterar livro</div>
                </div>
            }
        </div>
    );
}

export default SideMenu; */