import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./index.module.css";
import User from "/src/shared/assets/user.png";
import Login from "/src/shared/assets/login.png";
import Write from "/src/shared/assets/write.png";
import Password from "/src/shared/assets/password.png";

const ArtistUpdatePage = () => {

    interface Artist {
        name: string;
        login: string;
        email: string;
        password: string;
        bio: string;
      }

    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        navigate(path);
    }
    const {login} = useParams();
    const [artist, setArtist] = useState<Artist>({
        name: "",
        login: "",
        email: "",
        password: "",
        bio: ""
    });
    const [backup, setBackup] = useState<Artist>({
        name: "",
        login: "",
        email: "",
        password: "",
        bio: ""
    });

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target; // Extrai nome e valor do input
        setArtist((prevArtist) => ({
            ...prevArtist,  // Garante que usa o estado atualizado
            [name]: value
        }));
    };

    useEffect(() => {
        fetch(`http://localhost:5001/artists/${login}`) // Ajuste a URL do backend
            .then((response) => {
                if (!response.ok) throw new Error("Artista não encontrado");
                return response.json();
            })
            .then((data) => {
                setArtist(data);
                setBackup(data);
            })
    }, [login]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Evita que a página recarregue
        try {
            if(artist.name == "") {artist.name = backup.name};
            if(artist.login == "") {artist.login = backup.login};
            if(artist.password.length < 6) {throw new Error("Sua senha deve conter pelo menos 6 caracteres.")};
            const response = await fetch("http://localhost:5001/artists/" + login, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(artist)
            });
            console.log("Dados enviados:", artist);

            const responseText = await response.text(); // Pega a resposta do servidor
            const responseData = JSON.parse(responseText);
    
            if (!response.ok) throw new Error(responseData.error || "Erro desconhecido");

            showToastMessage(responseData.message); // Define a mensagem do toast
            setTimeout(() => navigateTo('/artists/' + artist.login), 1500);
            // setArtist ({
            //     name: "",
            //     login: "",
            //     email: "",
            //     password: "",
            //     bio: ""
            // });

        } catch (error) {
            showToastMessage((error as Error).message); // Define a mensagem do toast
        }  
    };

    return (
        <div className={styles.main}>
            <h1 className={styles.header}>Edição de dados de artista</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.card}>
                    <div className={styles.inputer}>
                        <img src={User} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="text" name="name" value={artist.name} onChange={handleChange} placeholder="Novo nome"/>
                    </div>
                    <div className={styles.inputer}>
                        <img src={Login} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="text" name="login" value={artist.login} onChange={handleChange} placeholder="Novo login"/>
                    </div>
                    <div className={styles.inputer}>
                        <img src={Password} alt={"Photo"} className={styles.regPhoto}/>
                        <input type="password" name="password" value={artist.password} onChange={handleChange} placeholder="Nova senha"/>
                    </div>
                    <div className={styles.bioInputer}>
                    <img src={Write} alt={"Photo"} className={styles.bioPhoto}/>
                        <textarea name="bio" value={artist.bio} onChange={handleChange} placeholder="Sobre o artista..."/>
                    </div>
                </div>
                <button className={styles.button} type="submit">Confirmar</button>
                <button className={styles.button} type="button" onClick={() => navigateTo('/artists/' + login)}>Cancelar</button>
            </form>
            {showToast && (
                <div className={styles.toast}>
                    {toastMessage}
                </div>
            )}
        </div>
    )
}

export default ArtistUpdatePage;