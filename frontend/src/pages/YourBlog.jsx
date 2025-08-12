// import { Card } from "@/components/ui/card";
import { Card } from "../components/ui/card";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setBlog } from "@/redux/blogSlice";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const YourBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);

  // ✅ Modificato lo stato per salvare sia l'ID che il titolo del blog da eliminare
  const [blogToDelete, setBlogToDelete] = useState({ id: null, title: '' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getOwnBlog = async () => {
    try {
      const res = await axios.get(
        `https://webeliteblogenzo.onrender.com/blog/get-own-blogs`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs));
      }
    } catch (error) {
      console.error("Errore nel recupero dei blog:", error);
      dispatch(setBlog([]));
      toast.error("Si è verificato un errore durante il recupero dei blog.");
    }
  };

  // Funzione per l'eliminazione effettiva del blog, chiamata dopo la conferma
  const handleConfirmDelete = async () => {
    // ✅ Usa l'ID salvato nello stato 'blogToDelete'
    if (!blogToDelete.id) return;

    try {
      const res = await axios.delete(
        `https://webeliteblogenzo.onrender.com/blog/delete/${blogToDelete.id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedBlogData = blog.filter(
          (blogItem) => blogItem?._id !== blogToDelete.id
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Si è verificato un errore durante l'eliminazione.");
    } finally {
      // ✅ Resetta lo stato del blog da eliminare
      setBlogToDelete({ id: null, title: '' });
      setIsDeleteDialogOpen(false);
    }
  };

  // ✅ Funzione che ora riceve anche il titolo e lo salva nello stato
  const handleDeleteClick = (id, title) => {
    setBlogToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    getOwnBlog();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT");
  };

  return (
    <div className="pb-10 pt-20 md:ml-[320px] h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>
              {blog && blog.length > 0
                ? "I tuoi blog recenti."
                : "Nessun blog creato."}
            </TableCaption>
            <TableHeader className="overflow-x-auto">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-auto ">
              {blog?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="flex gap-4 items-center">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-20 rounded-md hidden md:block"
                    />
                    <h1
                      className="hover:underline cursor-pointer"
                      onClick={() => navigate(`/blogs/${item._id}`)}
                    >
                      {item.title}
                    </h1>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDotsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[180px]">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/dashboard/write-blog/${item._id}`)
                          }
                        >
                          <Edit />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          // ✅ Passa l'ID e il titolo del blog alla funzione
                          onSelect={(e) => {
                            e.preventDefault();
                            handleDeleteClick(item._id, item.title);
                          }}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Dialogo di conferma per l'eliminazione */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
              {/* ✅ Inserito il titolo del blog nella descrizione */}
              <AlertDialogDescription>
                Questa azione non può essere annullata. Verrà eliminato in modo
                permanente il tuo blog dal titolo: &quot;{blogToDelete.title}&quot; e i commenti ad esso associati saranno rimossi dal nostro server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Continua
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default YourBlog;
