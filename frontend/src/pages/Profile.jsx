// /* eslint-disable no-unused-vars */
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import userLogo from "../assets/user.jpg";
// import { FaFacebook, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Link, useNavigate } from "react-router-dom";
// import { Textarea } from "@/components/ui/textarea";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { setUser } from "@/redux/authSlice";
// import TotalProperty from "@/components/TotalProperty";
// import { ChangePassword } from "./ChangePassword";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Ho aggiunto isAuthenticated e loading dallo store Redux
//   const { user, isAuthenticated, loading: authLoading } = useSelector(
//     (store) => store.auth
//   );

//   const [input, setInput] = useState({
//     firstName: "",
//     lastName: "",
//     occupation: "",
//     bio: "",
//     facebook: "",
//     linkedin: "",
//     github: "",
//     instagram: "",
//     file: null,
//   });

//   // ✅ CORREZIONE CHIAVE: Usa useEffect per popolare lo stato 'input' solo quando 'user' è disponibile
//   useEffect(() => {
//     if (user) {
//       setInput({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         occupation: user.occupation || "",
//         bio: user.bio || "",
//         facebook: user.facebook || "",
//         linkedin: user.linkedin || "",
//         github: user.github || "",
//         instagram: user.instagram || "",
//         file: user.photoUrl || null,
//       });
//     }
//   }, [user]); // L'effetto si attiva ogni volta che 'user' cambia nello store

//   const changeEventHandler = (e) => {
//     const { name, value } = e.target;
//     setInput((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const changeFileHandler = (e) => {
//     setInput({ ...input, file: e.target.files?.[0] });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("firstName", input.firstName);
//     formData.append("lastName", input.lastName);
//     formData.append("bio", input.bio);
//     formData.append("occupation", input.occupation);
//     formData.append("facebook", input.facebook);
//     formData.append("linkedin", input.linkedin);
//     formData.append("instagram", input.instagram);
//     formData.append("github", input.github);
//     if (input?.file) {
//       formData.append("file", input?.file);
//     }

//     try {
//       setLoading(true);
//       const res = await axios.put(
//         `https://webeliteblogenzo.onrender.com/api/v1/user/profile/update`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         setOpen(false);
//         toast.success(res.data.message);
//         dispatch(setUser(res.data.user));
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ CORREZIONE CHIAVE: Renderizza un loader se l'autenticazione è in corso
//   if (authLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
//       </div>
//     );
//   }

//   // ✅ CORREZIONE CHIAVE: Reindirizza o mostra un messaggio se l'utente non è autenticato
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-xl">Utente non trovato. Riprova il login.</p>
//       </div>
//     );
//   }

//   // Il resto del componente viene renderizzato solo dopo i controlli
//   return (
//     <div className="pt-20 md:ml-[320px] md:h-screen">
//       <div className="max-w-6xl mx-auto mt-8 ">
//         <Card className=" flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
//           {/* image section */}
//           <div className="flex flex-col items-center justify-center md:w-[400px]">
//             <Avatar className="w-40 h-40 border-2">
//               <AvatarImage src={user?.photoUrl || userLogo} />
//             </Avatar>
//             <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
//               {user?.occupation || "Mern Stack Developer"}
//             </h1>
//             <div className="flex gap-4 items-center">
//               <Link to={`${user?.facebook}`} target="_blank">
//                 <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
//               </Link>
//               <Link to={`${user?.linkedin}`} target="_blank">
//                 <FaLinkedin className="w-6 h-6 dark:text-gray-300 text-gray-800" />
//               </Link>
//               <Link to={`${user?.github}`} target="_blank">
//                 <FaGithub className="w-6 h-6 dark:text-gray-300 text-gray-800" />
//               </Link>
//               <Link to={`${user?.instagram}`} target="_blank">
//                 <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
//               </Link>
//             </div>
//           </div>
//           {/* info section */}
//           <div>
//             <h1 className="font-bold text-center md:text-start md:text-4xl text-3xl mb-7">
//               Welcome {user?.firstName}!
//             </h1>
//             <p className="">
//               <span className="font-semibold">Email : </span>
//               {user?.email}
//             </p>
//             <div className="flex flex-col gap-2 items-start justify-start my-5">
//               <Label className="">Description</Label>
//               <p className="border dark:border-gray-600 p-5  rounded-lg">
//                 {user?.bio ||
//                   "Sono uno sviluppatore web e creatore di contenuti, specializzato in tecnologie frontend. Quando non scrivo codice, mi trovate a scrivere di tecnologia."}
//               </p>
//             </div>

//             <div className="flex gap-4 mt-6 items-center justify-center">
//               <Dialog open={open} onOpenChange={setOpen}>
//                 <Button onClick={() => setOpen(true)}>Modifica Profilo</Button>
//                 <DialogContent className="md:w-[425px] ">
//                   <DialogHeader>
//                     <DialogTitle className="text-center">
//                       Modifica Profilo
//                     </DialogTitle>
//                     <DialogDescription className="text-center text-teal-600">
//                       Apporta modifiche al tuo profilo.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="grid gap-4 py-4">
//                     <div className="flex gap-2">
//                       <div>
//                         <Label htmlFor="name" className="text-right">
//                           First Name
//                         </Label>
//                         <Input
//                           id="firstName"
//                           name="firstName"
//                           value={input.firstName}
//                           onChange={changeEventHandler}
//                           placeholder="First Name"
//                           type="text"
//                           className="col-span-3 text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="name" className="text-right">
//                           Last Name
//                         </Label>
//                         <Input
//                           id="lastName"
//                           name="lastName"
//                           value={input.lastName}
//                           onChange={changeEventHandler}
//                           placeholder="Last Name"
//                           className="col-span-3 text-gray-500"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       <div>
//                         <Label>Facebook</Label>
//                         <Input
//                           id="facebook"
//                           name="facebook"
//                           value={input.facebook}
//                           onChange={changeEventHandler}
//                           placeholder="Enter a URL"
//                           className="col-span-3 text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <Label>Instagram</Label>
//                         <Input
//                           id="instagram"
//                           name="instagram"
//                           value={input.instagram}
//                           onChange={changeEventHandler}
//                           placeholder="Enter a URL"
//                           className="col-span-3 text-gray-500"
//                         />
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <div>
//                         <Label>Linkedin</Label>
//                         <Input
//                           id="linkedin"
//                           name="linkedin"
//                           value={input.linkedin}
//                           onChange={changeEventHandler}
//                           placeholder="Enter a URL"
//                           className="col-span-3 text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <Label>Github</Label>
//                         <Input
//                           id="github"
//                           name="github"
//                           value={input.github}
//                           onChange={changeEventHandler}
//                           placeholder="Enter a URL"
//                           className="col-span-3 text-gray-500"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <Label htmlFor="name" className="text-right">
//                         Description
//                       </Label>
//                       <Textarea
//                         id="bio"
//                         value={input.bio}
//                         onChange={changeEventHandler}
//                         name="bio"
//                         placeholder="Enter a description"
//                         className="col-span-3 text-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <Label>Occupation</Label>
//                       <Input
//                         id="occupation"
//                         name="occupation"
//                         value={input.occupation}
//                         onChange={changeEventHandler}
//                         placeholder="Enter a URL"
//                         className="col-span-3 text-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="name" className="text-right">
//                         Picture
//                       </Label>
//                       <Input
//                         id="file"
//                         type="file"
//                         accept="image/*"
//                         onChange={changeFileHandler}
//                         className="w-[277px]"
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     {loading ? (
//                       <Button>
//                         <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
//                         wait
//                       </Button>
//                     ) : (
//                       <Button onClick={submitHandler}>Salva Modifiche</Button>
//                     )}
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//               {/* ✅ Nuovo pulsante per la modifica della password */}
//               <Link to="/change-password">
//                 <Button className="max-w-fit text-[12px] font-medium text-purple-700 hover:text-blue-500 hover:bg-orange-400 border-b-2 hover:border-purple-400
//                      bg-orange-200 dark:border-white">Modifica Password</Button>
//               </Link>
//             </div>
//           </div>
//         </Card>
//       </div>
//       <TotalProperty />
//     </div>
//   );
// };
// export default Profile;


/* eslint-disable no-unused-vars */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Sostituito l'import locale con un'immagine placeholder per evitare errori di compilazione.
const userLogo = "https://placehold.co/160x160/cccccc/444444?text=User";
import { FaFacebook, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import TotalProperty from "@/components/TotalProperty";
import { ChangePassword } from "./ChangePassword";
import { logOut } from "@/redux/authSlice"; // Assicurati che il percorso sia corretto

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Nuovo stato per il dialog di eliminazione
  const [isDeleting, setIsDeleting] = useState(false); // Stato di caricamento per l'eliminazione

  const { user, isAuthenticated, loading: authLoading } = useSelector(
    (store) => store.auth
  );

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    bio: "",
    facebook: "",
    linkedin: "",
    github: "",
    instagram: "",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        occupation: user.occupation || "",
        bio: user.bio || "",
        facebook: user.facebook || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        instagram: user.instagram || "",
        file: user.photoUrl || null,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("linkedin", input.linkedin);
    formData.append("instagram", input.instagram);
    formData.append("github", input.github);
    if (input?.file) {
      formData.append("file", input?.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `https://webeliteblogenzo.onrender.com/api/v1/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestisce la logica di eliminazione dell'utente.
   * Visualizza un toast di successo, esegue il logout tramite Redux
   * e reindirizza l'utente alla pagina di login.
   */
  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      // Endpoint per eliminare l'utente (da confermare con il tuo backend)
      const res = await axios.delete(
        `https://webeliteblogenzo.onrender.com/api/v1/user/delete-account`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(logOut()); // Esegue il logout
        navigate('/login'); // Reindirizza l'utente dopo l'eliminazione
      }
    } catch (error) {
      console.log(error);
      toast.error("Errore durante l'eliminazione dell'account.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false); // Chiude il dialog
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Utente non trovato. Riprova il login.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:ml-[320px] md:h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className=" flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className="flex flex-col items-center justify-center md:w-[400px]">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
              {user?.occupation || "Mern Stack Developer"}
            </h1>
            <div className="flex gap-4 items-center">
              <Link to={`${user?.facebook}`} target="_blank">
                <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
              </Link>
              <Link to={`${user?.linkedin}`} target="_blank">
                <FaLinkedin className="w-6 h-6 dark:text-gray-300 text-gray-800" />
              </Link>
              <Link to={`${user?.github}`} target="_blank">
                <FaGithub className="w-6 h-6 dark:text-gray-300 text-gray-800" />
              </Link>
              <Link to={`${user?.instagram}`} target="_blank">
                <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
              </Link>
            </div>
          </div>
          {/* info section */}
          <div>
            <h1 className="font-bold text-center md:text-start md:text-4xl text-3xl mb-7">
              Welcome {user?.firstName}!
            </h1>
            <p className="">
              <span className="font-semibold">Email : </span>
              {user?.email}
            </p>
            <div className="flex flex-col gap-2 items-start justify-start my-5">
              <Label className="">Description</Label>
              <p className="border dark:border-gray-600 p-5  rounded-lg">
                {user?.bio ||
                  "Sono uno sviluppatore web e creatore di contenuti, specializzato in tecnologie frontend. Quando non scrivo codice, mi trovate a scrivere di tecnologia."}
              </p>
            </div>

            <div className="flex gap-4 mt-6 items-center justify-center">
              <Dialog open={open} onOpenChange={setOpen}>
                <Button onClick={() => setOpen(true)}>Modifica Profilo</Button>
                <DialogContent className="md:w-[425px] ">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Modifica Profilo
                    </DialogTitle>
                    <DialogDescription className="text-center text-teal-600">
                      Apporta modifiche al tuo profilo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex gap-2">
                      <div>
                        <Label htmlFor="name" className="text-right">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={input.firstName}
                          onChange={changeEventHandler}
                          placeholder="First Name"
                          type="text"
                          className="col-span-3 text-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name" className="text-right">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={input.lastName}
                          onChange={changeEventHandler}
                          placeholder="Last Name"
                          className="col-span-3 text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div>
                        <Label>Facebook</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          value={input.facebook}
                          onChange={changeEventHandler}
                          placeholder="Enter a URL"
                          className="col-span-3 text-gray-500"
                        />
                      </div>
                      <div>
                        <Label>Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={input.instagram}
                          onChange={changeEventHandler}
                          placeholder="Enter a URL"
                          className="col-span-3 text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <Label>Linkedin</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={input.linkedin}
                          onChange={changeEventHandler}
                          placeholder="Enter a URL"
                          className="col-span-3 text-gray-500"
                        />
                      </div>
                      <div>
                        <Label>Github</Label>
                        <Input
                          id="github"
                          name="github"
                          value={input.github}
                          onChange={changeEventHandler}
                          placeholder="Enter a URL"
                          className="col-span-3 text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="bio"
                        value={input.bio}
                        onChange={changeEventHandler}
                        name="bio"
                        placeholder="Enter a description"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label>Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={input.occupation}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Picture
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="w-[277px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    {loading ? (
                      <Button>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <Button onClick={submitHandler}>Salva Modifiche</Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Pulsante per la modifica della password */}
              <Link to="/change-password">
                <Button className="max-w-fit text-[12px] font-medium text-purple-700 hover:text-blue-500 hover:bg-orange-400 border-b-2 hover:border-purple-400
                      bg-orange-200 dark:border-white">Modifica Password</Button>
              </Link>

              {/* Nuovo pulsante per eliminare l'account */}
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Elimina Account
              </Button>

              {/* Dialogo di conferma per l'eliminazione */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Conferma Eliminazione Account</DialogTitle>
                    <DialogDescription>
                      Sei sicuro di voler eliminare il tuo account? Tutti i tuoi
                      dati, inclusi i blog e i commenti, verranno eliminati
                      definitivamente. Questa azione non può essere annullata.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Annulla
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteUser}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> In corso...
                        </>
                      ) : (
                        "Conferma Eliminazione"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      </div>
      <TotalProperty />
    </div>
  );
};

export default Profile;