import { Dialog, DialogContent } from './ui/dialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setOpenEditModal, setSelectedBook } from '@/redux/features/books/bookSlice';
import BookForm from './book-form';
import { toast } from 'sonner';
import type { BookFormData } from '@/lib/validations/book';
import { useUpdateBookMutation } from '@/redux/features/books/booksApi';

const EditBookModal = () => {
  const { selectedBook, openEditModal } = useAppSelector(state => state.books);
  const dispatch = useAppDispatch();
  const [updateBook, { isLoading }] = useUpdateBookMutation()

  const handleOpen = (e: boolean) => {
    dispatch(setSelectedBook(null))
    dispatch(setOpenEditModal(e))
  };

  if (!selectedBook) {
    return null;
  }

  const handleClose = () => {
    dispatch(setSelectedBook(null))
    dispatch(setOpenEditModal(false));
  };

  const handleSubmit = async (e: BookFormData) => {
    try {
      await updateBook({ formData: e, id: selectedBook._id }).unwrap();
      toast.success("Book updated successfully!");
      handleClose();

    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any
      toast.error("Failed to update book", { description: error?.data?.message || error?.error || error })
    }
  }

  return (
    <Dialog open={openEditModal} onOpenChange={handleOpen}>
      <DialogContent className='max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:pr-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-800'>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
          <BookForm initialValues={selectedBook} onClose={handleClose} onSubmit={handleSubmit} isSubmitting={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditBookModal