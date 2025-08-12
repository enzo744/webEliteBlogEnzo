import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Modal from "@/components/Modal";
import EncryptDecrypt from "@/components/EncryptDecrypt";

const UpdateBlog = () => {
    const editor = useRef(null);

    const [loading, setLoading] = useState(false);
    const [publish, setPublish] = useState(false);
    const [openEncryptDecryptModal, setOpenEncryptDecryptModal] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFetchingBlog, setIsFetchingBlog] = useState(true); // Stato per il caricamento del blog

    const params = useParams();
    const id = params.blogId;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blog } = useSelector(store => store.blog);

    const [content, setContent] = useState("");
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const [blogData, setBlogData] = useState({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        campoLibero: "",
    });

    // Funzione per recuperare il blog specifico
    const fetchBlog = async () => {
        try {
            setIsFetchingBlog(true);
            const res = await axios.get(`https://webeliteblogenzo.onrender.com/api/v1/blog/${id}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                const fetchedBlog = res.data.blog;
                setBlogData({
                    title: fetchedBlog.title || "",
                    subtitle: fetchedBlog.subtitle || "",
                    description: fetchedBlog.description || "",
                    category: fetchedBlog.category || "",
                    campoLibero: fetchedBlog.campoLibero || "", //
                });
                setContent(fetchedBlog.description || "");
                setPreviewThumbnail(fetchedBlog.thumbnail || "");
                setPublish(fetchedBlog.isPublished || false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Errore nel caricamento del blog");
        } finally {
            setIsFetchingBlog(false);
        }
    };

    // Chiama la funzione di recupero dati quando il componente si monta o l'ID cambia
    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value });
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updateBlogHandler = async () => {
        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("subtitle", blogData.subtitle);
        formData.append("description", content);
        formData.append("category", blogData.category);
        formData.append("campoLibero", blogData.campoLibero);

        if (blogData.thumbnail) {
            formData.append("file", blogData.thumbnail);
        }
        try {
            setLoading(true);
            const res = await axios.put(`https://webeliteblogenzo.onrender.com/api/v1/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setBlog(blog.map(b => b._id === id ? res.data.blog : b)));
                toast.success(res.data.message);
                navigate('/dashboard/your-blog');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const togglePublishUnpublish = async () => {
        const newPublishState = !publish;
        try {
            const res = await axios.patch(`https://webeliteblogenzo.onrender.com/api/v1/blog/${id}/publish?publish=${newPublishState}`, null, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setBlog(blog.map(b => b._id === id ? { ...b, isPublished: newPublishState } : b)));
                toast.success(res.data.message);
                navigate(`/dashboard/your-blog`);
            } else {
                toast.error("Failed to update");
            }
        } catch (error) {
            console.error(error);
            toast.error("something went wrong");
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`https://webeliteblogenzo.onrender.com/api/v1/blog/delete/${id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
                dispatch(setBlog(updatedBlogData));
                toast.success(res.data.message);
                navigate("/dashboard/your-blog");
            }
        } catch (error) {
            console.error(error);
            toast.error("something went error");
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    // Mostra un messaggio di caricamento
    if (isFetchingBlog) {
        return <div className="flex items-center justify-center h-screen md:ml-[320px]">
            <p>Caricamento blog...</p>
        </div>;
    }

    return (
        <div className='pb-10 px-3 pt-20 md:ml-[320px]'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">
                    <h1 className='text-4xl font-bold'>Informazioni sul blog</h1>
                    <p className=''>Apporta modifiche ai tuoi blog qui. Clicca su Pubblica quando hai finito.</p>
                    <div className="space-x-2">
                        <Button onClick={() => togglePublishUnpublish()}>
                            {publish ? "UnPublish" : "Publish"}
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Remove Blog</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Questa azione non può essere annullata. Verrà eliminato in modo permanente questo blog e rimosso dai nostri server.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleConfirmDelete}>Continua</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className='pt-10'>
                        <Label>Title</Label>
                        <Input type="text" placeholder="Enter a title" name="title" value={blogData.title} onChange={handleChange} className="dark:border-gray-300" />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input type="text" placeholder="Enter a subtitle" name="subtitle" value={blogData.subtitle} onChange={handleChange} className="dark:border-gray-300" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onChange={newContent => setContent(newContent)}
                            className="jodit_toolbar"
                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Select onValueChange={selectCategory} value={blogData.category}>
                            <SelectTrigger className="w-[180px] dark:border-gray-300">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Web Development">Web Development</SelectItem>
                                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                    <SelectItem value="Blogging">Blogging</SelectItem>
                                    <SelectItem value="Personale">Personale</SelectItem>
                                    <SelectItem value="Photography">Photography</SelectItem>
                                    <SelectItem value="Cooking">Cooking</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label>Thumbnail</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={selectThumbnail}
                                accept="image/*"
                                className="w-fit dark:border-gray-300"
                            />
                            {previewThumbnail && (
                                <img
                                    src={previewThumbnail}
                                    className="w-64 my-2 rounded"
                                    alt="Blog Thumbnail"
                                />
                            )}
                        </div>
                        <div>
                            <Label>Campo Libero</Label>
                            <Input
                                type="text"
                                placeholder="Campo libero"
                                name="campoLibero"
                                value={blogData.campoLibero}
                                onChange={handleChange}
                                className="dark:border-gray-300"
                            />
                        </div>
                    </div>
                    <div className='flex gap-3 justify-center'>
                        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        <Button
                            className="text-purple-600 hover:text-slate-700 hover:bg-linear-to-r hover:from-purple-500 hover:to-indigo-500 border border-purple-500 hover:border-purple-700 bg-orange-200 dark:bg-orange-300"
                            onClick={() => setOpenEncryptDecryptModal(true)}
                        >
                            Cripta/Decripta
                        </Button>
                        <Button onClick={updateBlogHandler}>
                            {
                                loading ? "Please Wait" : "Save"
                            }
                        </Button>
                    </div>
                </Card>
            </div>
            <Modal
                isOpen={openEncryptDecryptModal}
                onClose={() => setOpenEncryptDecryptModal(false)}
                title="Strumento Cripta / Decripta"
            >
                <EncryptDecrypt />
            </Modal>
        </div>
    );
};

export default UpdateBlog;
