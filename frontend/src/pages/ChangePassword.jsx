import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
// ✅ Importa le icone per mostrare/nascondere la password
import { Eye, EyeOff, X } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();
  // Estrai l'utente loggato dallo stato Redux
  const { user } = useSelector((store) => store.auth);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Nuovi stati per controllare la visibilità di ciascun campo
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validazione della lunghezza della nuova password sul frontend
    if (passwords.newPassword.length < 6) {
        toast.error("La nuova password deve contenere almeno 6 caratteri.");
        return;
    }

    // Validazione front-end
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("La nuova password e la conferma non coincidono.");
      return;
    }
    
    // Controlla che le password non siano uguali
    if (passwords.currentPassword === passwords.newPassword) {
        toast.error("La nuova password non può essere uguale a quella attuale.");
        return;
    }

    try {
      // Chiamata API al nuovo endpoint del backend
      const response = await axios.put(
        `https://webeliteblogenzo.onrender.com/api/v1/user/change-password`,
        passwords,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Si è verificato un errore durante la modifica della password.");
      }
      console.error(error);
    }
  };

  const handleClose = () => {
    // navigate("/profile");
    navigate(-1);
  };

  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px]">
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
        <Card className="relative w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
        {/* ✅ Icona di chiusura in alto a destra */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 
            dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Modifica Password
            </CardTitle>
            <p className='text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center'>
              Ciao <span className="font-bold">{user?.firstName}</span>, inserisci le password per aggiornarle.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* ✅ Campo Vecchia Password con toggle */}
              <div className="relative">
                <Label>Vecchia Password</Label>
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Inserisci la password attuale"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* ✅ Campo Nuova Password con toggle */}
              <div className="relative">
                <Label>Nuova Password</Label>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Inserisci la nuova password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* ✅ Campo Conferma Nuova Password con toggle */}
              <div className="relative">
                <Label>Conferma Nuova Password</Label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Conferma la nuova password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="w-fit">
                Modifica Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
