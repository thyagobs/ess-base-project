import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./index.module.css";
import User from "/src/shared/assets/user.png";
import Email from "/src/shared/assets/email.png";
import Login from "/src/shared/assets/login.png";
import Password from "/src/shared/assets/password.png";

const ArtistRegistrationPage = () => {

    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        navigate(path);
    }

    const [artist, setArtist] = useState({
        name: "",
        login: "",
        email: "",
        password: "",
        bio: ""
    });

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target; // Extrai nome e valor do input
        setArtist((prevArtist) => ({
            ...prevArtist,  // Garante que usa o estado atualizado
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Evita que a página recarregue
        try {
            const response = await fetch("http://localhost:5001/artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(artist)
            });

            const responseText = await response.text(); // Pega a resposta do servidor
            const responseData = JSON.parse(responseText);
    
            if (!response.ok) throw new Error(responseData.error || "Erro desconhecido");

            setToastMessage(responseData.message); // Define a mensagem do toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setArtist({ name: "", login: "", email: "", password: "", bio: ""}); // Resetar formulário
            setTimeout(() => navigateTo('/artistlogin'), 1500);
        } catch (error) {
            setToastMessage((error as Error).message); // Define a mensagem do toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }  
      };

    return (
        <div className={styles.main}>
            <h1 className={styles.header}>Cadastro de artista</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.card}>
                    <div className={styles.inputer}>
                        <img src={User} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="text" name="name" value={artist.name} onChange={handleChange} placeholder="Nome" required/>
                    </div>
                    <div className={styles.inputer}>
                        <img src={Login} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="text" name="login" value={artist.login} onChange={handleChange} placeholder="Login" required/>
                    </div>
                    <div className={styles.inputer}>
                        <img src={Email} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="email" name="email" value={artist.email} onChange={handleChange} placeholder="E-mail" required/>
                    </div>
                    <div className={styles.inputer}>
                        <img src={Password} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="password" name="password" value={artist.password} onChange={handleChange} placeholder="Senha" required/>
                    </div>
                </div>
                <button className={styles.button} type="submit">Cadastrar</button>
                <button className={styles.regButton} type="button" onClick={() => navigateTo('/artistlogin')}>Já sou cadastrado</button>
            </form>
            {showToast && (
                <div className={styles.toast}>
                    {toastMessage}
                </div>
            )}
        </div>
    )
}

export default ArtistRegistrationPage;