import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        success: false, // Aggiungi success: false per coerenza
        message: "Blog title and category are required.",
      });
    }

    const blog = await Blog.create({
      title,
      category,
      author: req.id,
    });

    // Popola l'autore se vuoi restituirlo al frontend
    const createdBlog = await Blog.findById(blog._id).populate({
      path: "author",
      select: "firstName lastName photoUrl",
    });

    return res.status(201).json({
      success: true,
      //   blog,
      blog: createdBlog,
      message: "Blog Created Successfully.",
    });
  } catch (error) {
    console.error("Error creating blog:", error); // Usa console.error
    return res.status(500).json({
      success: false, // Aggiungi success: false
      message: "Failed to create blog",
      error: error.message, // Includi l'errore per il debug
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category, campoLibero } = req.body;
    const file = req.file; // Il nuovo file della thumbnail, se presente

    let blog = await Blog.findById(blogId); // Trova il blog esistente per accedere alla vecchia thumbnail
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }

    // ✅ CONTROLLO DI SICUREZZA: Verifica che l'utente autenticato sia l'autore del blog.
    if (blog.author.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "Non sei autorizzato a modificare questo blog.",
      });
    }

    const oldThumbnailPublicId = blog.thumbnailPublicId; // Salva il publicId della vecchia thumbnail

    let newThumbnailUrl = blog.thumbnail; // Inizializza con l'URL attuale
    let newThumbnailPublicId = blog.thumbnailPublicId; // Inizializza con il Public ID attuale

    // Se un nuovo file è stato caricato per la thumbnail
    if (file) {
      const fileUri = getDataUri(file);
      const uploadedThumbnail = await cloudinary.uploader.upload(fileUri);

      newThumbnailUrl = uploadedThumbnail.secure_url;
      newThumbnailPublicId = uploadedThumbnail.public_id;

      // Se c'era una vecchia thumbnail eliminala
      if (
        oldThumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(oldThumbnailPublicId);
          console.log(
            `Vecchia thumbnail con publicId ${oldThumbnailPublicId} eliminata da Cloudinary.`
          );
        } catch (cloudinaryError) {
          console.error(
            `Errore durante l'eliminazione della vecchia thumbnail da Cloudinary:`,
            cloudinaryError
          );
          // Non bloccare l'aggiornamento del blog se l'eliminazione fallisce
        }
      }
    }

    // Costruisci l'oggetto con i dati da aggiornare
    const updateData = {
      title: title || blog.title, // Usa il nuovo titolo o mantieni il vecchio
      subtitle: subtitle || blog.subtitle,
      description: description || blog.description,
      category: category || blog.category,
      campoLibero: campoLibero || blog.campoLibero,
      // author: req.id, // L'autore di solito non cambia in un update
      thumbnail: newThumbnailUrl,
      thumbnailPublicId: newThumbnailPublicId, // Salva il nuovo publicId
    };

    // Aggiorna il blog
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
    }).populate({ path: "author", select: "firstName lastName photoUrl" }); // Popola l'autore per la risposta

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog, // Restituisci il blog aggiornato e popolato
    });
  } catch (error) {
    console.error("Error updating blog:", error); // Usa console.error
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Funzione per recuperare un singolo blog tramite ID
export const getSingleBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Cerca il blog per ID e popola i dati dell'autore
    const blog = await Blog.findById(blogId).populate({
      path: "author",
      select: "firstName lastName photoUrl",
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }

    return res.status(200).json({
      success: true,
      blog: blog,
    });
  } catch (error) {
    // console.error("Error fetching single blog:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching single blog",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (_, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching all blogs:", error); // Usa console.error
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "firstName lastName photoUrl" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      });
    if (!blogs) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error getting published blogs:", error); // Usa console.error
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
      error: error.message, // Includi l'errore per il debug
    });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { publish } = req.query; // true, false come stringhe

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }

    // Converte la stringa 'true'/'false' in booleano
    const shouldPublish = publish === "true";

    // Imposta lo stato di pubblicazione in base al parametro della query
    blog.isPublished = shouldPublish;
    await blog.save();

    const statusMessage = blog.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Blog is ${statusMessage}`,
      blog: blog, // Potresti voler restituire il blog aggiornato
    });
  } catch (error) {
    console.error("Error toggling publish status:", error); // Usa console.error
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// Funzione usata per recuperare i blog di un utente autenticato
export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.id; // Assume l'ID dell'utente autenticato (req.id), inserito dal middleware isAuthenticated.
    if (!userId) { // Controlla che l'ID dell'utente esista. Se no, restituisce un errore con 400 Bad Request.
      return res.status(400).json({
        success: false, // Aggiungi success: false
        message: "User ID is required.",
      });
    }
    const blogs = await Blog.find({ author: userId })
    //  Cerca tutti i blog nel database in cui il campo author corrisponde all’utente autenticato.
    // Popola il campo author con i dettagli del profilo dell'autore, ma solo con i campi specificati
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
//       Popola anche il campo comments, e per ogni commento:
//       - ordina i commenti in ordine crescente per data di creazione  
//       - popola il campo userId (cioè chi ha scritto il commento) con nome, cognome e foto.
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl", // seleziona solo i campi di nome, cognome e foto
        },
      });

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        blogs: [],
        message: "Nessun blog trovato per questo utente.",
      });
    }
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    console.error("Error fetching own blogs:", error); // Usa console.error
    res.status(500).json({
      success: false, // Aggiungi success: false
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog non trovato" });
    }

    // Verifica che l'utente autenticato sia l'autore del blog
    if (blog.author.toString() !== authorId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Non autorizzato a eliminare questo blog",
        });
    }

    // Elimina la thumbnail da Cloudinary se esiste
    if (blog.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(blog.thumbnailPublicId);
        console.log(
          `Thumbnail del blog con publicId ${blog.thumbnailPublicId} eliminata da Cloudinary.`
        );
      } catch (cloudinaryError) {
        console.error(
          `Errore durante l'eliminazione della thumbnail del blog da Cloudinary:`,
          cloudinaryError
        );
        // Non bloccare l'eliminazione del blog se l'eliminazione della thumbnail fallisce
      }
    }
    // Elimina il blog dal database
    await Blog.findByIdAndDelete(blogId);
    // ✅ Elimina i commenti correlati (assicurati che il campo sia 'blog' nel modello Comment)
    await Comment.deleteMany({ blog: blogId }); // Assumendo che il campo sia 'blog' e non 'postId'

    res
      .status(200)
      .json({ success: true, message: "Blog eliminato con successo" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const likeKrneWalaUserKiId = req.id;
    const blog = await Blog.findById(blogId).populate({ path: "likes" });
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });

    // Check if user already liked the blog
    // const alreadyLiked = blog.likes.includes(userId);

    //like logic started
    await blog.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await blog.save();

    return res.status(200).json({ message: "Blog liked", blog, success: true });
  } catch (error) {
    console.error("Error liking blog:", error); // Usa console.error
    return res.status(500).json({
      success: false,
      message: "Failed to like blog",
      error: error.message,
    });
  }
};

export const dislikeBlog = async (req, res) => {
  try {
    const userId = req.id; // Rinominato per chiarezza
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });

    // Rimuovi l'ID dell'utente dall'array 'likes'
    await Blog.updateOne({ _id: blogId }, { $pull: { likes: userId } });

    // Potresti voler ri-fetchare il blog o aggiornare l'oggetto blog corrente
    const updatedBlog = await Blog.findById(blogId).populate("likes");

    return res
      .status(200)
      .json({ message: "Blog disliked", blog: updatedBlog, success: true });
  } catch (error) {
    console.error("Error disliking blog:", error); // Usa console.error
    return res.status(500).json({
      success: false,
      message: "Failed to dislike blog",
      error: error.message,
    });
  }
};

export const getMyTotalBlogLikes = async (req, res) => {
  try {
    const userId = req.id; // assuming you use authentication middleware

    // Step 1: Find all blogs authored by the logged-in user
    const myBlogs = await Blog.find({ author: userId }).select("likes");

    // Step 2: Sum up the total likes
    const totalLikes = myBlogs.reduce(
      (acc, blog) => acc + (blog.likes?.length || 0),
      0
    );

    res.status(200).json({
      success: true,
      totalBlogs: myBlogs.length,
      totalLikes,
    });
  } catch (error) {
    console.error("Error getting total blog likes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total blog likes",
    });
  }
};
