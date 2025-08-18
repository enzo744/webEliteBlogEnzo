import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // const existingUserByUsername = await User.findOne({ userName: userName });

    // if (existingUserByUsername) {
    //     return res.status(400).json({ success: false, message: "Username already exists" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return res.status(400).json({
        success: false,
        message: "Compilare i campi richiesti!",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Credenziali non valide!",
      });
    }

    const token =  jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.firstName}`,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Login",
    });
  }
};

export const google = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.SECRET_KEY
      );

      const { password: pass, ...rest } = user._doc
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const newUser = new User({
        firstName: 
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
          lastName:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
      });
      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id },
        process.env.SECRET_KEY
      );

      const { password: pass, ...rest } = newUser._doc
      return res
        .status(200)
        .cookie("access_token", token, { httpsOnly: true })
        .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id; // Assumendo che req.id sia impostato da un middleware di autenticazione
    const {
      firstName,
      lastName,
      occupation,
      bio,
      instagram,
      facebook,
      linkedin,
      github,
    } = req.body;
    const file = req.file; // req.file è popolato dal middleware multer se un file è inviato

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Utente non trovato",
        success: false,
      });
    }

    // --- LOGICA PER L'AGGIORNAMENTO E L'ELIMINAZIONE DELLA FOTO ---
    let newPhotoUrl = user.photoUrl; // Inizializza con l'URL attuale
    let newPhotoPublicId = user.photoPublicId; // Inizializza con il Public ID attuale

    // Se è stato fornito un nuovo file per la foto
    if (file) {
      console.log("Nuovo file foto ricevuto. Caricamento su Cloudinary...");
      const fileUri = getDataUri(file);
      let cloudResponse = await cloudinary.uploader.upload(fileUri);

      // Aggiorna i nuovi valori dell'URL e del Public ID
      newPhotoUrl = cloudResponse.secure_url;
      newPhotoPublicId = cloudResponse.public_id;

      // Se l'utente aveva già una foto e il suo publicId è diverso dal nuovo
      // (Questo indica una sostituzione della foto)
      if (user.photoPublicId && user.photoPublicId !== newPhotoPublicId) {
        console.log(
          `Tentativo di eliminare la vecchia foto con publicId: ${user.photoPublicId}`
        );
        try {
          // Elimina la vecchia foto da Cloudinary
          await cloudinary.uploader.destroy(user.photoPublicId);
          console.log(
            `Vecchia foto con publicId ${user.photoPublicId} eliminata con successo da Cloudinary.`
          );
        } catch (cloudinaryError) {
          console.error(
            `Errore durante l'eliminazione della vecchia foto da Cloudinary (publicId: ${user.photoPublicId}):`,
            cloudinaryError
          );
          // Non bloccare l'aggiornamento del profilo se l'eliminazione fallisce
        }
      }
      //   else if (user.photoPublicId && user.photoPublicId === newPhotoPublicId) {
      //       console.log("La nuova foto ha lo stesso publicId della vecchia. Nessuna eliminazione necessaria.");
      //   } else {
      //       console.log("Nessun vecchio publicId trovato per l'eliminazione.");
      //   }
      // } else {
      //     console.log("Nessun nuovo file foto fornito. Mantenendo la foto esistente.");
    }
    // --- FINE LOGICA FOTO ---

    // Aggiorna i campi testuali del profilo
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (occupation) user.occupation = occupation;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (bio) user.bio = bio;

    // Aggiorna i campi della foto nel modello utente
    user.photoUrl = newPhotoUrl;
    user.photoPublicId = newPhotoPublicId;

    await user.save(); // Salva tutte le modifiche al profilo utente

    return res.status(200).json({
      message: "Profilo aggiornato con successo",
      success: true,
      user, // Restituisci l'utente aggiornato
    });
  } catch (error) {
    console.error("Errore nell'aggiornamento del profilo:", error);
    return res.status(500).json({
      success: false,
      message: "Impossibile aggiornare il profilo",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password field
    res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.id; // L'ID dell'utente autenticato dal token JWT

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Tutti i campi sono obbligatori.",
      });
    }

    // ✅ Aggiungi la validazione della lunghezza della nuova password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La password deve contenere almeno 6 caratteri.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "La nuova password e la conferma non coincidono.",
      });
    }

    // Controlla che la nuova password non sia uguale a quella attuale
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "La nuova password non può essere uguale a quella attuale.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato.",
      });
    }

    // Verifica che la vecchia password corrisponda
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "La password attuale non è corretta.",
      });
    }

    // Hash della nuova password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password aggiornata con successo!",
    });
  } catch (error) {
    console.error("Errore durante la modifica della password:", error);
    res.status(500).json({
      success: false,
      message:
        "Si è verificato un errore durante l'aggiornamento della password.",
    });
  }
};
